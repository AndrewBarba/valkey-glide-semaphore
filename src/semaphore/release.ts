import createDebug from 'debug';
import type { RedisClient } from '../types';

const debug = createDebug('redis-semaphore:semaphore:release');

export async function releaseSemaphore(client: RedisClient, key: string, identifier: string): Promise<void> {
  debug(key, identifier);
  const result = await client.zrem(key, [identifier]);
  debug('result', typeof result, result);
}
