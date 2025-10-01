import type { RedisClient } from '../../types.js';
export interface Options {
    identifier: string;
    lockTimeout: number;
    now: number;
}
export declare function releaseSemaphore(client: RedisClient, key: string, permits: number, identifier: string): Promise<void>;
