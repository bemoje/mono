import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachIterable } from './forEachIterable'
import { it } from 'vitest'

describe(forEachIterable.name, () => {
  it('should iterate over an iterable', () => {
    const values: number[] = []
    forEachIterable([1, 2, 3], (v) => {
      values.push(v)
    })
    expect(values).toEqual([1, 2, 3])
  })

  it('should do nothing for empty iterable', () => {
    let called = false
    forEachIterable([], () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with a generator', () => {
    function* gen() {
      yield 'a'
      yield 'b'
    }
    const values: string[] = []
    forEachIterable(gen(), (v) => {
      values.push(v)
    })
    expect(values).toEqual(['a', 'b'])
  })
})
