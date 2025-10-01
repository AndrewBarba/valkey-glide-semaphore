import createDebug from 'debug';
import { releaseLua } from '../multiSemaphore/release/lua.js';
const debug = createDebug('redis-semaphore:redlock-mutex:release');
export async function releaseRedlockMultiSemaphore(clients, key, permits, identifier) {
    debug(key, identifier);
    const promises = clients.map((client) => releaseLua(client, [key, permits, identifier]).catch(() => 0));
    const results = await Promise.all(promises);
    debug('resu.js', results);
}
