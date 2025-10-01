import createDebug from 'debug';
import { releaseLua } from './lua.js';
const debug = createDebug('redis-semaphore:multi-semaphore:release');
export async function releaseSemaphore(client, key, permits, identifier) {
    debug(key, identifier, permits);
    const result = await releaseLua(client, [key, permits, identifier]);
    debug('result', typeof result, result);
}
