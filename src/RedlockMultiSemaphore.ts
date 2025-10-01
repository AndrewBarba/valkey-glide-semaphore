import RedlockSemaphore from './RedlockSemaphore.ts';
import { acquireRedlockMultiSemaphore } from './redlockMultiSemaphore/acquire.ts';
import { refreshRedlockMultiSemaphore } from './redlockMultiSemaphore/refresh.ts';
import { releaseRedlockMultiSemaphore } from './redlockMultiSemaphore/release.ts';
import type { LockOptions, RedisClient } from './types.ts';

export default class RedlockMultiSemaphore extends RedlockSemaphore {
  protected _kind = 'redlock-multi-semaphore';
  protected _permits: number;

  constructor(clients: RedisClient[], key: string, limit: number, permits: number, options?: LockOptions) {
    super(clients, key, limit, options);
    if (!permits) {
      throw new Error('"permits" is required');
    }
    if (typeof permits !== 'number') {
      throw new Error('"permits" must be a number');
    }
    this._permits = permits;
  }

  protected async _refresh(): Promise<boolean> {
    return await refreshRedlockMultiSemaphore(
      this._clients,
      this._key,
      this._limit,
      this._permits,
      this._acquireOptions,
    );
  }

  protected async _acquire(): Promise<boolean> {
    return await acquireRedlockMultiSemaphore(
      this._clients,
      this._key,
      this._limit,
      this._permits,
      this._acquireOptions,
    );
  }

  protected async _release(): Promise<void> {
    await releaseRedlockMultiSemaphore(this._clients, this._key, this._permits, this._identifier);
  }
}
