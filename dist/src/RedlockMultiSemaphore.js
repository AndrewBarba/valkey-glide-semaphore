import RedlockSemaphore from './RedlockSemaphore.js';
import { acquireRedlockMultiSemaphore } from './redlockMultiSemaphore/acquire.js';
import { refreshRedlockMultiSemaphore } from './redlockMultiSemaphore/refresh.js';
import { releaseRedlockMultiSemaphore } from './redlockMultiSemaphore/release.js';
export default class RedlockMultiSemaphore extends RedlockSemaphore {
    _kind = 'redlock-multi-semaphore';
    _permits;
    constructor(clients, key, limit, permits, options) {
        super(clients, key, limit, options);
        if (!permits) {
            throw new Error('"permits" is required');
        }
        if (typeof permits !== 'number') {
            throw new Error('"permits" must be a number');
        }
        this._permits = permits;
    }
    async _refresh() {
        return await refreshRedlockMultiSemaphore(this._clients, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _acquire() {
        return await acquireRedlockMultiSemaphore(this._clients, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _release() {
        await releaseRedlockMultiSemaphore(this._clients, this._key, this._permits, this._identifier);
    }
}
