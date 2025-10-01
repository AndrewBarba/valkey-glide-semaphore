import type { RedisClient } from '../types.js';
export declare const delIfEqualLua: (client: RedisClient, args: [string, string]) => Promise<0 | 1>;
export declare function releaseMutex(client: RedisClient, key: string, identifier: string): Promise<void>;
