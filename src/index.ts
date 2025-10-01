import LostLockError from './errors/LostLockError.ts';
import TimeoutError from './errors/TimeoutError.ts';
import MultiSemaphore from './RedisMultiSemaphore.ts';
import Mutex from './RedisMutex.ts';
import Semaphore from './RedisSemaphore.ts';
import RedlockMultiSemaphore from './RedlockMultiSemaphore.ts';
import RedlockMutex from './RedlockMutex.ts';
import RedlockSemaphore from './RedlockSemaphore.ts';

export { defaultTimeoutOptions } from './misc.ts';

export {
  Mutex,
  Semaphore,
  MultiSemaphore,
  RedlockMutex,
  RedlockSemaphore,
  RedlockMultiSemaphore,
  LostLockError,
  TimeoutError,
};

export type { LockLostCallback, LockOptions, TimeoutOptions } from './types.ts';
