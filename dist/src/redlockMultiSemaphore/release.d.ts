import type { RedisClient } from '../types.js';
export declare function releaseRedlockMultiSemaphore(clients: RedisClient[], key: string, permits: number, identifier: string): Promise<void>;
