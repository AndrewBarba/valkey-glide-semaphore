import type { RedisClient } from '../types.js';
interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshRedlockSemaphore(clients: RedisClient[], key: string, limit: number, options: Options): Promise<boolean>;
export {};
