import type { AcquireOptions, LockLostCallback, LockOptions } from './types.js';
export declare abstract class Lock {
    protected abstract _kind: string;
    protected abstract _key: string;
    protected _identifier: string;
    protected _acquireOptions: AcquireOptions;
    protected _refreshTimeInterval: number;
    protected _refreshInterval?: ReturnType<typeof setInterval>;
    protected _refreshing: boolean;
    protected _acquired: boolean;
    protected _acquiredExternally: boolean;
    protected _onLockLost: LockLostCallback;
    protected abstract _refresh(): Promise<boolean>;
    protected abstract _acquire(): Promise<boolean>;
    protected abstract _release(): Promise<void>;
    constructor({ lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval, refreshInterval, onLockLost, externallyAcquiredIdentifier, identifierSuffix, identifier, acquiredExternally, }?: LockOptions);
    get identifier(): string;
    get isAcquired(): boolean;
    private getIdentifier;
    private _startRefresh;
    stopRefresh(): void;
    private _processRefresh;
    acquire(): Promise<void>;
    tryAcquire(): Promise<boolean>;
    release(): Promise<void>;
}
