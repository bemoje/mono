import { describe, it, vi, expect, beforeEach } from 'vitest'
import { sequence } from './sequence'

describe(sequence.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should return a function', () => {
    expect(sequence(vi.fn(), vi.fn())).toBeTypeOf('function')
  })

  it('should execute all provided functions in sequence', async () => {
    const mockFunc1 = vi.fn().mockResolvedValue(undefined)
    const mockFunc2 = vi.fn().mockResolvedValue(undefined)
    const mockFunc3 = vi.fn().mockResolvedValue(undefined)

    const sequencedFunc = sequence(mockFunc1, mockFunc2, mockFunc3)

    await sequencedFunc()

    expect(mockFunc1).toHaveBeenCalledTimes(1)
    expect(mockFunc2).toHaveBeenCalledTimes(1)
    expect(mockFunc3).toHaveBeenCalledTimes(1)

    expect(mockFunc1.mock.invocationCallOrder).toStrictEqual([1])
    expect(mockFunc2.mock.invocationCallOrder).toStrictEqual([2])
    expect(mockFunc3.mock.invocationCallOrder).toStrictEqual([3])
  })

  it('should handle an empty sequence without error', async () => {
    const sequencedFunc = sequence()
    await expect(sequencedFunc()).resolves.toBe(void 0)
  })
})
