import RedisMutex from './RedisMutex.js';
import { acquireSemaphore } from './semaphore/acquire/index.js';
import { refreshSemaphore } from './semaphore/refresh/index.js';
import { releaseSemaphore } from './semaphore/release.js';
import type { GlideClient, LockOptions } from './types.js';

export default class RedisSemaphore extends RedisMutex {
  protected _kind = 'semaphore';
  protected _limit: number;

  constructor(client: GlideClient, key: string, limit: number, options?: LockOptions) {
    super(client, key, options);
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
    return await refreshSemaphore(this._client, this._key, this._limit, this._acquireOptions);
  }

  protected async _acquire(): Promise<boolean> {
    return await acquireSemaphore(this._client, this._key, this._limit, this._acquireOptions);
  }

  protected async _release(): Promise<void> {
    await releaseSemaphore(this._client, this._key, this._identifier);
  }
}
