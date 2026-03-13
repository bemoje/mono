import { describe } from 'vitest'
import { expect } from 'vitest'
import { getFileAge } from './getFileAge'
import { it } from 'vitest'
import { vi } from 'vitest'

const mockStat = vi.fn()

vi.mock('fs-extra', () => {
  return {
    default: {
      stat: (...args: any[]) => {
        return mockStat(...args)
      },
    },
    stat: (...args: any[]) => {
      return mockStat(...args)
    },
  }
})

describe(getFileAge.name, () => {
  it('should return the age of a file in milliseconds using ctimeMs', async () => {
    const now = Date.now()
    mockStat.mockResolvedValueOnce({ ctimeMs: now - 100, birthtimeMs: now - 200, mtimeMs: now - 300 })
    const age = await getFileAge('test-file')
    expect(age).toBeGreaterThanOrEqual(50)
    expect(age).toBeLessThan(500)
  })

  it('should fall back to birthtimeMs when ctimeMs is 0', async () => {
    const now = Date.now()
    mockStat.mockResolvedValueOnce({ ctimeMs: 0, birthtimeMs: now - 100, mtimeMs: now - 200 })
    const age = await getFileAge('any')
    expect(age).toBeGreaterThanOrEqual(50)
    expect(age).toBeLessThan(500)
  })

  it('should fall back to mtimeMs when ctimeMs and birthtimeMs are 0', async () => {
    const now = Date.now()
    mockStat.mockResolvedValueOnce({ ctimeMs: 0, birthtimeMs: 0, mtimeMs: now - 100 })
    const age = await getFileAge('any')
    expect(age).toBeGreaterThanOrEqual(50)
    expect(age).toBeLessThan(500)
  })
})
