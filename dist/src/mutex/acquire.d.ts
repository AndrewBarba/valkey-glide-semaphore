import type { RedisClient } from '../types.js';
export interface Options {
    identifier: string;
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
}
export declare function acquireMutex(client: RedisClient, key: string, options: Options): Promise<boolean>;
