import type { RedisClient } from '../types.js';
export declare function releaseRedlockMutex(clients: RedisClient[], key: string, identifier: string): Promise<void>;
