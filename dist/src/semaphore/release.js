import createDebug from 'debug';
const debug = createDebug('redis-semaphore:semaphore:release');
export async function releaseSemaphore(client, key, identifier) {
    debug(key, identifier);
    const result = await client.zrem(key, [identifier]);
    debug('result', typeof result, result);
}
