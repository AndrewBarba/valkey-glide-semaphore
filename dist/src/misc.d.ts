import type LostLockError from './errors/LostLockError.js';
export declare const defaultTimeoutOptions: {
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
};
export declare function defaultOnLockLost(err: LostLockError): never;
