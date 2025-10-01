import type { RedisClient } from '../../types.js';
export interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshSemaphore(client: RedisClient, key: string, limit: number, options: Options): Promise<boolean>;
