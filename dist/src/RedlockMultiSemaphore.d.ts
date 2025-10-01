import RedlockSemaphore from './RedlockSemaphore.js';
import type { LockOptions, RedisClient } from './types.js';
export default class RedlockMultiSemaphore extends RedlockSemaphore {
    protected _kind: string;
    protected _permits: number;
    constructor(clients: RedisClient[], key: string, limit: number, permits: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
