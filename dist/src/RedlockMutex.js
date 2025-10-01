import { Lock } from './Lock.js';
import { defaultTimeoutOptions } from './misc.js';
import { acquireRedlockMutex } from './redlockMutex/acquire.js';
import { refreshRedlockMutex } from './redlockMutex/refresh.js';
import { releaseRedlockMutex } from './redlockMutex/release.js';
export default class RedlockMutex extends Lock {
    _kind = 'redlock-mutex';
    _key;
    _clients;
    constructor(clients, key, options = defaultTimeoutOptions) {
        super(options);
        if (!clients || !Array.isArray(clients)) {
            throw new Error('"clients" array is required');
        }
        if (!key) {
            throw new Error('"key" is required');
        }
        if (typeof key !== 'string') {
            throw new Error('"key" must be a string');
        }
        this._clients = clients;
        this._key = `mutex:${key}`;
    }
    async _refresh() {
        return await refreshRedlockMutex(this._clients, this._key, this._identifier, this._acquireOptions.lockTimeout);
    }
    async _acquire() {
        return await acquireRedlockMutex(this._clients, this._key, this._acquireOptions);
    }
    async _release() {
        await releaseRedlockMutex(this._clients, this._key, this._identifier);
    }
}
