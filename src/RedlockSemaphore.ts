import RedlockMutex from './RedlockMutex.ts';
import { acquireRedlockSemaphore } from './redlockSemaphore/acquire.ts';
import { refreshRedlockSemaphore } from './redlockSemaphore/refresh.ts';
import { releaseRedlockSemaphore } from './redlockSemaphore/release.ts';
import type { LockOptions, RedisClient } from './types.ts';

export default class RedlockSemaphore extends RedlockMutex {
  protected _kind = 'redlock-semaphore';
  protected _limit: number;

  constructor(clients: RedisClient[], key: string, limit: number, options?: LockOptions) {
    super(clients, key, options);
    if (!limit) {
      throw new Error('"limit" is required');
    }
    if (typeof limit !== 'number') {
      throw new Error('"limit" must be a number');
    }
    this._key = `semaphore:${key}`;
    this._limit = limit;
  }

  protected async _refresh(): Promise<boolean> {
    return await refreshRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
  }

  protected async _acquire(): Promise<boolean> {
    return await acquireRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
  }

  protected async _release(): Promise<void> {
    await releaseRedlockSemaphore(this._clients, this._key, this._identifier);
  }
}
