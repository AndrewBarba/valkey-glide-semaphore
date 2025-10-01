import type { RedisClient } from '../types.js';
export declare function releaseSemaphore(client: RedisClient, key: string, identifier: string): Promise<void>;
