import createDebug from 'debug';
import { delIfEqualLua } from '../mutex/release.js';

import type { GlideClient } from '../types.js';

const debug = createDebug('redis-semaphore:redlock-mutex:release');

export async function releaseRedlockMutex(
  clients: GlideClient[],
  key: string,
  identifier: string,
): Promise<void> {
  debug(key, identifier);
  const promises = clients.map((client) => delIfEqualLua(client, [key, identifier]).catch(() => 0));
  const results = await Promise.all(promises);
  debug('resu.js', results);
}
