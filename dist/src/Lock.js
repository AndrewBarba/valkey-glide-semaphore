import * as crypto from 'node:crypto';
import createDebug from 'debug';
import LostLockError from './errors/LostLockError.js';
import TimeoutError from './errors/TimeoutError.js';
import { defaultOnLockLost, defaultTimeoutOptions } from './misc.js';
const REFRESH_INTERVAL_COEF = 0.8;
const debug = createDebug('redis-semaphore:instance');
export class Lock {
    _identifier;
    _acquireOptions;
    _refreshTimeInterval;
    _refreshInterval;
    _refreshing = false;
    _acquired = false;
    _acquiredExternally = false;
    _onLockLost;
    constructor({ lockTimeout = defaultTimeoutOptions.lockTimeout, acquireTimeout = defaultTimeoutOptions.acquireTimeout, acquireAttemptsLimit = defaultTimeoutOptions.acquireAttemptsLimit, retryInterval = defaultTimeoutOptions.retryInterval, refreshInterval = Math.round(lockTimeout * REFRESH_INTERVAL_COEF), onLockLost = defaultOnLockLost, externallyAcquiredIdentifier, identifierSuffix, identifier, acquiredExternally, } = defaultTimeoutOptions) {
        if (identifier !== undefined && (!identifier || typeof identifier !== 'string')) {
            throw new Error('identifier must be not empty random string');
        }
        if (acquiredExternally && !identifier) {
            throw new Error('acquiredExternally=true meanless without custom identifier');
        }
        if (externallyAcquiredIdentifier && (identifier || acquiredExternally)) {
            throw new Error('Invalid usage. Use custom identifier and acquiredExternally: true');
        }
        this._identifier = identifier || externallyAcquiredIdentifier || this.getIdentifier(identifierSuffix);
        this._acquiredExternally = !!acquiredExternally || !!externallyAcquiredIdentifier;
        this._acquireOptions = {
            lockTimeout,
            acquireTimeout,
            acquireAttemptsLimit,
            retryInterval,
            identifier: this._identifier,
        };
        this._refreshTimeInterval = refreshInterval;
        this._onLockLost = onLockLost;
    }
    get identifier() {
        return this._identifier;
    }
    get isAcquired() {
        return this._acquired;
    }
    getIdentifier(identifierSuffix) {
        const uuid = crypto.randomUUID();
        return identifierSuffix ? `${uuid}-${identifierSuffix}` : uuid;
    }
    _startRefresh() {
        this._refreshInterval = setInterval(this._processRefresh, this._refreshTimeInterval);
        this._refreshInterval.unref();
    }
    stopRefresh() {
        if (this._refreshInterval) {
            debug(`clear refresh interval ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
            clearInterval(this._refreshInterval);
        }
    }
    _processRefresh = async () => {
        if (this._refreshing) {
            debug(`already refreshing ${this._kind} (key: ${this._key}, identifier: ${this._identifier}) (skip)`);
            return;
        }
        this._refreshing = true;
        try {
            debug(`refresh ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
            const refreshed = await this._refresh();
            if (!refreshed) {
                if (!this._acquired) {
                    debug(`refresh ${this._kind} (key: ${this._key}, identifier: ${this._identifier} failed, but lock was purposefully released`);
                    return;
                }
                this._acquired = false;
                this.stopRefresh();
                const lockLostError = new LostLockError(`Lost ${this._kind} for key ${this._key}`);
                this._onLockLost(lockLostError);
            }
        }
        finally {
            this._refreshing = false;
        }
    };
    async acquire() {
        debug(`acquire ${this._kind} (key: ${this._key})`);
        const acquired = await this.tryAcquire();
        if (!acquired) {
            throw new TimeoutError(`Acquire ${this._kind} ${this._key} timeout`);
        }
    }
    async tryAcquire() {
        debug(`tryAcquire ${this._kind} (key: ${this._key})`);
        const acquired = this._acquiredExternally ? await this._refresh() : await this._acquire();
        if (!acquired) {
            return false;
        }
        this._acquired = true;
        this._acquiredExternally = false;
        if (this._refreshTimeInterval > 0) {
            this._startRefresh();
        }
        return true;
    }
    async release() {
        debug(`release ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
        if (this._refreshTimeInterval > 0) {
            this.stopRefresh();
        }
        if (this._acquired || this._acquiredExternally) {
            await this._release();
        }
        this._acquired = false;
        this._acquiredExternally = false;
    }
}
