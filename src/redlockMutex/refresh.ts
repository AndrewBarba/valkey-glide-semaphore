import { TimeUnit } from '@valkey/valkey-glide';
import createDebug from 'debug';
import { expireIfEqualLua } from '../mutex/refresh.js';
import { delIfEqualLua } from '../mutex/release.js';
import type { RedisClient } from '../types.js';
import { getQuorum, smartSum } from '../utils/redlock.js';

const debug = createDebug('redis-semaphore:redlock-mutex:refresh');

export async function refreshRedlockMutex(
  clients: RedisClient[],
  key: string,
  identifier: string,
  lockTimeout: number,
): Promise<boolean> {
  debug(key, identifier);
  const quorum = getQuorum(clients.length);
  let promises = clients.map((client) =>
    expireIfEqualLua(client, [key, identifier, lockTimeout])
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
        .reduce<RedisClient[]>((failedClients: RedisClient[], result: number, index: number) => {
          if (!result) {
            failedClients.push(clients[index]);
          }
          return failedClients;
        }, [])
        .map((client: RedisClient) =>
          client
            .set(key, identifier, {
              conditionalSet: 'onlyIfDoesNotExist',
              expiry: {
                count: lockTimeout,
                type: TimeUnit.Milliseconds,
              },
            })
            .then((result) => (result === 'OK' ? 1 : 0))
            .catch(() => 0),
        );
      const acquireResults = await Promise.all(promises);
      debug(key, identifier, 'acquire on failed nodes resu.js', acquireResults);
    }
    return true;
  }
  promises = clients.map((client) => delIfEqualLua(client, [key, identifier]).catch(() => 0));
  await Promise.all(promises);
  return false;
}
