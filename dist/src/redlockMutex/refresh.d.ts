import type { RedisClient } from '../types.js';
export declare function refreshRedlockMutex(clients: RedisClient[], key: string, identifier: string, lockTimeout: number): Promise<boolean>;
