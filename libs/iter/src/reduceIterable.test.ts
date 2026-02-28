import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { reduceIterable } from './reduceIterable'

describe(reduceIterable.name, () => {
  it('should reduce an iterable to a single value', () => {
    const result = reduceIterable(
      [1, 2, 3],
      (acc, v) => {
        return acc + v
      },
      0,
    )
    expect(result).toBe(6)
  })

  it('should return initialValue for empty iterable', () => {
    const result = reduceIterable(
      [],
      (acc, v: number) => {
        return acc + v
      },
      42,
    )
    expect(result).toBe(42)
  })

  it('should work with a generator', () => {
    function* gen() {
      yield 'a'
      yield 'b'
      yield 'c'
    }
    const result = reduceIterable(
      gen(),
      (acc, v) => {
        return acc + v
      },
      '',
    )
    expect(result).toBe('abc')
  })
})
