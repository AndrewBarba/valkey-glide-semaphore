import createDebug from 'debug';
import type { GlideClient } from '../../types.js';
import { refreshLua } from './lua.js';

const debug = createDebug('redis-semaphore:multi-semaphore:refresh');

export interface Options {
  identifier: string;
  lockTimeout: number;
}

export async function refreshSemaphore(
  client: GlideClient,
  key: string,
  limit: number,
  permits: number,
  options: Options,
): Promise<boolean> {
  const { identifier, lockTimeout } = options;
  const now = Date.now();
  debug(key, identifier, now);
  const result = await refreshLua(client, [key, limit, permits, identifier, lockTimeout, now]);
  debug('result', typeof result, result);
  return result === 1;
}
