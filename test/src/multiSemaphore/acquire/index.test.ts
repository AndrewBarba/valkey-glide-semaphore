import { expect } from 'chai'

import {
  acquireSemaphore as acquire,
  Options
} from '../../../../src/multiSemaphore/acquire/index'
import { client1 as client } from '../../../redisClient'

const opts = (id: string, overrides?: Partial<Options>): Options => ({
  identifier: id,
  acquireTimeout: 50,
  acquireAttemptsLimit: Number.POSITIVE_INFINITY,
  lockTimeout: 100,
  retryInterval: 10,
  ...overrides
})

describe('multiSemaphore acquire', () => {
  it('should return true for success acquire', async () => {
    const result = await acquire(client, 'key', 1, 1, opts('111'))
    expect(await client.zrange('key', 0, -1)).to.be.eql(['111_0'])
    expect(result).to.be.true
  })
  it('should return false when timeout', async () => {
    const result1 = await acquire(client, 'key', 2, 1, opts('111')) // expire after 100ms
    const result2 = await acquire(client, 'key', 2, 1, opts('112')) // expire after 100ms
    const result3 = await acquire(client, 'key', 2, 1, opts('113')) // timeout after 50ms

    expect(result1).to.be.true
    expect(result2).to.be.true
    expect(result3).to.be.false
  })
  it('should return false after acquireAttemptsLimit', async () => {
    const result1 = await acquire(client, 'key', 2, 1, opts('111')) // expire after 100ms
    const result2 = await acquire(client, 'key', 2, 1, opts('112')) // expire after 100ms
    const result3 = await acquire(
      client,
      'key',
      2,
      1,
      opts('113', {
        acquireAttemptsLimit: 1,
        acquireTimeout: Number.POSITIVE_INFINITY
      })
    ) // no timeout, attempt limit = 1

    expect(result1).to.be.true
    expect(result2).to.be.true
    expect(result3).to.be.false
  })
})
