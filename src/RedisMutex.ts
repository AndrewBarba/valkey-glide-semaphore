import { Lock } from './Lock.ts';
import { acquireMutex } from './mutex/acquire.ts';
import { refreshMutex } from './mutex/refresh.ts';
import { releaseMutex } from './mutex/release.ts';
import type { LockOptions, RedisClient } from './types.ts';

export default class RedisMutex extends Lock {
  protected _kind = 'mutex';
  protected _key: string;
  protected _client: RedisClient;

  constructor(client: RedisClient, key: string, options?: LockOptions) {
    super(options);
    if (!client) {
      throw new Error('"client" is required');
    }
    if (!key) {
      throw new Error('"key" is required');
    }
    if (typeof key !== 'string') {
      throw new Error('"key" must be a string');
    }
    this._client = client;
    this._key = `mutex:${key}`;
  }

  protected async _refresh(): Promise<boolean> {
    return await refreshMutex(this._client, this._key, this._identifier, this._acquireOptions.lockTimeout);
  }

  protected async _acquire(): Promise<boolean> {
    return await acquireMutex(this._client, this._key, this._acquireOptions);
  }

  protected async _release(): Promise<void> {
    await releaseMutex(this._client, this._key, this._identifier);
  }
}
