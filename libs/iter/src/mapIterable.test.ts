import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapIterable } from './mapIterable'

describe(mapIterable.name, () => {
  it('should transform values of an iterable', () => {
    const result = [
      ...mapIterable([1, 2, 3], (v) => {
        return v * 2
      }),
    ]
    expect(result).toEqual([2, 4, 6])
  })

  it('should return empty iterable for empty input', () => {
    const result = [
      ...mapIterable([], (v: number) => {
        return v * 2
      }),
    ]
    expect(result).toEqual([])
  })

  it('should work with a generator', () => {
    function* gen() {
      yield 'a'
      yield 'b'
      yield 'c'
    }
    const result = [
      ...mapIterable(gen(), (v) => {
        return v.toUpperCase()
      }),
    ]
    expect(result).toEqual(['A', 'B', 'C'])
  })

  it('should return an iterable, not an array', () => {
    const result = mapIterable([1, 2], (v) => {
      return v
    })
    expect(Symbol.iterator in result).toBe(true)
  })

  it('should support type transformation', () => {
    const result = [
      ...mapIterable([1, 2, 3], (v) => {
        return String(v)
      }),
    ]
    expect(result).toEqual(['1', '2', '3'])
  })
})
