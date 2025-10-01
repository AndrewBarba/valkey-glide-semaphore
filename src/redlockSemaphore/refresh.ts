import createDebug from 'debug';
import { acquireLua } from '../semaphore/acquire/lua.js';
import { refreshLua } from '../semaphore/refresh/lua.js';
import type { GlideClient } from '../types.js';
import { getQuorum, smartSum } from '../utils/redlock.js';

const debug = createDebug('redis-semaphore:redlock-semaphore:refresh');

interface Options {
  identifier: string;
  lockTimeout: number;
}

export async function refreshRedlockSemaphore(
  clients: GlideClient[],
  key: string,
  limit: number,
  options: Options,
): Promise<boolean> {
  const { identifier, lockTimeout } = options;
  const now = Date.now();
  debug(key, identifier, now);
  const quorum = getQuorum(clients.length);
  let promises = clients.map((client) =>
    refreshLua(client, [key, limit, identifier, lockTimeout, now])
      .then((result: number) => +result)
      .catch(() => 0),
  );
  const results = await Promise.all(promises);
  debug('resu.js', results);
  const refreshedCount = results.reduce(smartSum, 0);
  if (refreshedCount >= quorum) {
    debug(key, identifier, 'refreshed');
    if (refreshedCount < clients.length) {
      debug(key, identifier, 'try to acquire on failed nodes');
      promises = results
        .reduce<GlideClient[]>((failedClients: GlideClient[], result: number, index: number) => {
          if (!result) {
            failedClients.push(clients[index]);
          }
          return failedClients;
        }, [])
        .map((client: GlideClient) =>
          acquireLua(client, [key, limit, identifier, lockTimeout, now])
            .then((result: number) => +result)
            .catch(() => 0),
        );
      const acquireResults = await Promise.all(promises);
      debug(key, identifier, 'acquire on failed nodes resu.js', acquireResults);
    }
    return true;
  }
  promises = clients.map((client) => client.zrem(key, [identifier]).catch(() => 0));
  await Promise.all(promises);
  return false;
}
