import { TimeUnit } from '@valkey/valkey-glide';
import createDebug from 'debug';
import { delIfEqualLua } from '../mutex/release.js';
import { delay } from '../utils/index.js';
import { getQuorum, smartSum } from '../utils/redlock.js';
const debug = createDebug('redis-semaphore:redlock-mutex:acquire');
export async function acquireRedlockMutex(clients, key, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    const quorum = getQuorum(clients.length);
    while (Date.now() < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, 'attempt', attempt);
        let promises = clients.map((client) => client
            .set(key, identifier, {
            conditionalSet: 'onlyIfDoesNotExist',
            expiry: {
                count: lockTimeout,
                type: TimeUnit.Milliseconds,
            },
        })
            .then((result) => (result === 'OK' ? 1 : 0))
            .catch(() => 0));
        const results = await Promise.all(promises);
        if (results.reduce(smartSum, 0) >= quorum) {
            debug(key, identifier, 'acquired');
            return true;
        }
        promises = clients.map((client) => delIfEqualLua(client, [key, identifier]).catch(() => 0));
        await Promise.all(promises);
        await delay(retryInterval);
    }
    debug(key, identifier, 'timeout or reach limit');
    return false;
}
