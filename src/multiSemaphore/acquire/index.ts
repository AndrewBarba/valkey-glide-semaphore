import createDebug from 'debug';
import type { RedisClient } from '../../types.js';
import { delay } from '../../utils/index.js';
import { acquireLua } from './lua.js';

const debug = createDebug('redis-semaphore:multi-semaphore:acquire');

export interface Options {
  identifier: string;
  lockTimeout: number;
  acquireTimeout: number;
  acquireAttemptsLimit: number;
  retryInterval: number;
}

export async function acquireSemaphore(
  client: RedisClient,
  key: string,
  limit: number,
  permits: number,
  options: Options,
): Promise<boolean> {
  const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
  let attempt = 0;
  const end = Date.now() + acquireTimeout;
  let now = Date.now();
  while (now < end && ++attempt <= acquireAttemptsLimit) {
    debug(key, identifier, limit, lockTimeout, 'attempt', attempt);
    const result = await acquireLua(client, [key, limit, permits, identifier, lockTimeout, now]);
    debug(key, 'result', typeof result, result);
    if (result === 1) {
      debug(key, identifier, 'acquired');
      return true;
    }
    await delay(retryInterval);
    now = Date.now();
  }
  debug(key, identifier, limit, lockTimeout, 'timeout or reach limit');
  return false;
}
