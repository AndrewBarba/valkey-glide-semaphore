import { Lock } from './Lock.js';
import type { LockOptions, RedisClient } from './types.js';
export default class RedlockMutex extends Lock {
    protected _kind: string;
    protected _key: string;
    protected _clients: RedisClient[];
    constructor(clients: RedisClient[], key: string, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
