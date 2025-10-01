import type { RedisClient } from '../types.js';
export declare function releaseRedlockSemaphore(clients: RedisClient[], key: string, identifier: string): Promise<void>;
