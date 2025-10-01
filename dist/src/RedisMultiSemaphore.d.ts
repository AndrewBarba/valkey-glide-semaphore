import RedisSemaphore from './RedisSemaphore.js';
import type { LockOptions, RedisClient } from './types.js';
export default class RedisMultiSemaphore extends RedisSemaphore {
    protected _kind: string;
    protected _permits: number;
    constructor(client: RedisClient, key: string, limit: number, permits: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
