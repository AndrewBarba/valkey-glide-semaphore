import createDebug from 'debug';
import { refreshLua } from './lua.js';
const debug = createDebug('redis-semaphore:multi-semaphore:refresh');
export async function refreshSemaphore(client, key, limit, permits, options) {
    const { identifier, lockTimeout } = options;
    const now = Date.now();
    debug(key, identifier, now);
    const result = await refreshLua(client, [key, limit, permits, identifier, lockTimeout, now]);
    debug('result', typeof result, result);
    return result === 1;
}
