import type { RedisClient } from '../types.js';
interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshRedlockMultiSemaphore(clients: RedisClient[], key: string, limit: number, permits: number, options: Options): Promise<boolean>;
export {};
