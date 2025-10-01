import type { RedisClient } from '../types.js';
export default function createEval<Args extends Array<number | string>, Result>(script: string, keysCount: number): (client: RedisClient, args: Args) => Promise<Result>;
