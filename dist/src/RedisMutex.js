import { Lock } from './Lock.js';
import { acquireMutex } from './mutex/acquire.js';
import { refreshMutex } from './mutex/refresh.js';
import { releaseMutex } from './mutex/release.js';
export default class RedisMutex extends Lock {
    _kind = 'mutex';
    _key;
    _client;
    constructor(client, key, options) {
        super(options);
        if (!client) {
            throw new Error('"client" is required');
        }
        if (!key) {
            throw new Error('"key" is required');
        }
        if (typeof key !== 'string') {
            throw new Error('"key" must be a string');
        }
        this._client = client;
        this._key = `mutex:${key}`;
    }
    async _refresh() {
        return await refreshMutex(this._client, this._key, this._identifier, this._acquireOptions.lockTimeout);
    }
    async _acquire() {
        return await acquireMutex(this._client, this._key, this._acquireOptions);
    }
    async _release() {
        await releaseMutex(this._client, this._key, this._identifier);
    }
}
