import createDebug from 'debug';
import type { RedisClient } from '../../types.js';
import { releaseLua } from './lua.js';

const debug = createDebug('redis-semaphore:multi-semaphore:release');

export interface Options {
  identifier: string;
  lockTimeout: number;
  now: number;
}

export async function releaseSemaphore(
  client: RedisClient,
  key: string,
  permits: number,
  identifier: string,
): Promise<void> {
  debug(key, identifier, permits);
  const result = await releaseLua(client, [key, permits, identifier]);
  debug('result', typeof result, result);
}
