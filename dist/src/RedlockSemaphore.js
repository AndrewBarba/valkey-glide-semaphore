import RedlockMutex from './RedlockMutex.js';
import { acquireRedlockSemaphore } from './redlockSemaphore/acquire.js';
import { refreshRedlockSemaphore } from './redlockSemaphore/refresh.js';
import { releaseRedlockSemaphore } from './redlockSemaphore/release.js';
export default class RedlockSemaphore extends RedlockMutex {
    _kind = 'redlock-semaphore';
    _limit;
    constructor(clients, key, limit, options) {
        super(clients, key, options);
        if (!limit) {
            throw new Error('"limit" is required');
        }
        if (typeof limit !== 'number') {
            throw new Error('"limit" must be a number');
        }
        this._key = `semaphore:${key}`;
        this._limit = limit;
    }
    async _refresh() {
        return await refreshRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _acquire() {
        return await acquireRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _release() {
        await releaseRedlockSemaphore(this._clients, this._key, this._identifier);
    }
}
