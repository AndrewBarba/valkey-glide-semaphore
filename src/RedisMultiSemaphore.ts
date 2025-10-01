import { acquireSemaphore } from './multiSemaphore/acquire/index.ts';
import { refreshSemaphore } from './multiSemaphore/refresh/index.ts';
import { releaseSemaphore } from './multiSemaphore/release/index.ts';
import RedisSemaphore from './RedisSemaphore.ts';
import type { LockOptions, RedisClient } from './types.ts';

export default class RedisMultiSemaphore extends RedisSemaphore {
  protected _kind = 'multi-semaphore';
  protected _permits: number;

  constructor(client: RedisClient, key: string, limit: number, permits: number, options?: LockOptions) {
    super(client, key, limit, options);
    if (!permits) {
      throw new Error('"permits" is required');
    }
    if (typeof permits !== 'number') {
      throw new Error('"permits" must be a number');
    }
    this._permits = permits;
  }

  protected async _refresh(): Promise<boolean> {
    return await refreshSemaphore(this._client, this._key, this._limit, this._permits, this._acquireOptions);
  }

  protected async _acquire(): Promise<boolean> {
    return await acquireSemaphore(this._client, this._key, this._limit, this._permits, this._acquireOptions);
  }

  protected async _release(): Promise<void> {
    await releaseSemaphore(this._client, this._key, this._permits, this._identifier);
  }
}
