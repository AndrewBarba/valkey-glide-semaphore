import type { RedisClient } from '../types.js';
export interface Options {
    identifier: string;
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
}
export declare function acquireRedlockSemaphore(clients: RedisClient[], key: string, limit: number, options: Options): Promise<boolean>;
