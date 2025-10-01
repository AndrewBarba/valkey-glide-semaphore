import createDebug from 'debug';
import type { GlideClient } from '../types.js';

const debug = createDebug('redis-semaphore:semaphore:release');

export async function releaseSemaphore(client: GlideClient, key: string, identifier: string): Promise<void> {
  debug(key, identifier);
  const result = await client.zrem(key, [identifier]);
  debug('result', typeof result, result);
}
