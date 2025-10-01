import RedlockMutex from './RedlockMutex.js';
import type { LockOptions, RedisClient } from './types.js';
export default class RedlockSemaphore extends RedlockMutex {
    protected _kind: string;
    protected _limit: number;
    constructor(clients: RedisClient[], key: string, limit: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
