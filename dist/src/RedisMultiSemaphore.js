import { acquireSemaphore } from './multiSemaphore/acquire/index.js';
import { refreshSemaphore } from './multiSemaphore/refresh/index.js';
import { releaseSemaphore } from './multiSemaphore/release/index.js';
import RedisSemaphore from './RedisSemaphore.js';
export default class RedisMultiSemaphore extends RedisSemaphore {
    _kind = 'multi-semaphore';
    _permits;
    constructor(client, key, limit, permits, options) {
        super(client, key, limit, options);
        if (!permits) {
            throw new Error('"permits" is required');
        }
        if (typeof permits !== 'number') {
            throw new Error('"permits" must be a number');
        }
        this._permits = permits;
    }
    async _refresh() {
        return await refreshSemaphore(this._client, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _acquire() {
        return await acquireSemaphore(this._client, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _release() {
        await releaseSemaphore(this._client, this._key, this._permits, this._identifier);
    }
}
