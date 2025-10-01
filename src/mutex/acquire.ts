import { TimeUnit } from '@valkey/valkey-glide';
import createDebug from 'debug';
import type { GlideClient } from '../types.js';
import { delay } from '../utils/index.js';

const debug = createDebug('redis-semaphore:mutex:acquire');

export interface Options {
  identifier: string;
  lockTimeout: number;
  acquireTimeout: number;
  acquireAttemptsLimit: number;
  retryInterval: number;
}

export async function acquireMutex(client: GlideClient, key: string, options: Options): Promise<boolean> {
  const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
  let attempt = 0;
  const end = Date.now() + acquireTimeout;
  while (Date.now() < end && ++attempt <= acquireAttemptsLimit) {
    debug(key, identifier, 'attempt', attempt);
    const result = await client.set(key, identifier, {
      conditionalSet: 'onlyIfDoesNotExist',
      expiry: {
        count: lockTimeout,
        type: TimeUnit.Milliseconds,
      },
    });
    debug('result', typeof result, result);
    if (result === 'OK') {
      debug(key, identifier, 'acquired');
      return true;
    }
    await delay(retryInterval);
  }
  debug(key, identifier, 'timeout or reach limit');
  return false;
}
