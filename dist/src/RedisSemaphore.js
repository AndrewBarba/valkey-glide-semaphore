import RedisMutex from './RedisMutex.js';
import { acquireSemaphore } from './semaphore/acquire/index.js';
import { refreshSemaphore } from './semaphore/refresh/index.js';
import { releaseSemaphore } from './semaphore/release.js';
export default class RedisSemaphore extends RedisMutex {
    _kind = 'semaphore';
    _limit;
    constructor(client, key, limit, options) {
        super(client, key, options);
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
        return await refreshSemaphore(this._client, this._key, this._limit, this._acquireOptions);
    }
    async _acquire() {
        return await acquireSemaphore(this._client, this._key, this._limit, this._acquireOptions);
    }
    async _release() {
        await releaseSemaphore(this._client, this._key, this._identifier);
    }
}
