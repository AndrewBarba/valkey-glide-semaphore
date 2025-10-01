import type { RedisClient } from '../types.js';
export declare const expireIfEqualLua: (client: RedisClient, args: [string, string, number]) => Promise<0 | 1>;
export declare function refreshMutex(client: RedisClient, key: string, identifier: string, lockTimeout: number): Promise<boolean>;
