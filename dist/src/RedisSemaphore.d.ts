import RedisMutex from './RedisMutex.js';
import type { LockOptions, RedisClient } from './types.js';
export default class RedisSemaphore extends RedisMutex {
    protected _kind: string;
    protected _limit: number;
    constructor(client: RedisClient, key: string, limit: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
