import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { arrAssign } from './arrAssign'

describe(arrAssign.name, () => {
  it('examples', () => {
    expect(() => {
      const target = [1, 2, 3, 4]
      const source = [null, undefined, 7, 8]
      const result = arrAssign(target, source)

      // Should assign by index position, excluding null and undefined values
      assert.deepStrictEqual(result, [1, 2, 7, 8])
    }).not.toThrow()
  })

  it('should assign by index position excluding null and undefined values', () => {
    const target = [1, 2, 3, 4]
    const source = [10, 20, 30, 40]
    const result = arrAssign(target, source)
    expect(result).toEqual([10, 20, 30, 40])
  })

  it('should exclude null values', () => {
    const target = [1, 2, 3, 4]
    const source = [null, 20, null, 40]
    const result = arrAssign(target, source)
    expect(result).toEqual([1, 20, 3, 40])
  })

  it('should exclude undefined values', () => {
    const target = [1, 2, 3, 4]
    const source = [undefined, 20, undefined, 40]
    const result = arrAssign(target, source)
    expect(result).toEqual([1, 20, 3, 40])
  })

  it('should handle shorter source array', () => {
    const target = [1, 2, 3, 4]
    const source = [10, 20]
    const result = arrAssign(target, source)
    expect(result).toEqual([10, 20, 3, 4])
  })

  it('should handle longer source array', () => {
    const target = [1, 2]
    const source = [10, 20, 30, 40]
    const result = arrAssign(target, source)
    // Target is mutated in place, source values beyond target length are assigned
    expect(result).toEqual([10, 20, 30, 40])
  })

  it('should maintain target length when source has null/undefined', () => {
    const target = [1, 2, 3, 4]
    const source = [null, undefined, null, undefined]
    const result = arrAssign(target, source)
    expect(result).toEqual([1, 2, 3, 4])
  })
})
