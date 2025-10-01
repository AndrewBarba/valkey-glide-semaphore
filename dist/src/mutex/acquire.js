import { TimeUnit } from '@valkey/valkey-glide';
import createDebug from 'debug';
import { delay } from '../utils/index.js';
const debug = createDebug('redis-semaphore:mutex:acquire');
export async function acquireMutex(client, key, options) {
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
