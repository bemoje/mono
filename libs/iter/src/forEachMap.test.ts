import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachMap } from './forEachMap'
import { it } from 'vitest'

describe(forEachMap.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate map
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const results: string[] = []
      forEachMap(map, (value, key) => {
        results.push(`${key}:${value}`)
      })
      assert.deepStrictEqual(results, ['a:1', 'b:2', 'c:3'], 'forEach map')
    }).not.toThrow()
  })

  it('should execute callback for each entry', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const values: number[] = []
    forEachMap(map, (value) => {
      values.push(value)
    })
    expect(values).toEqual([1, 2, 3])
  })

  it('should provide both value and key', () => {
    const map = new Map([
      ['apple', 1],
      ['banana', 2],
    ])
    const results: Array<[number, string]> = []
    forEachMap(map, (value, key) => {
      results.push([value, key])
    })
    expect(results).toEqual([
      [1, 'apple'],
      [2, 'banana'],
    ])
  })

  it('should handle empty map', () => {
    let called = false
    forEachMap(new Map(), () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with ReadonlyMap', () => {
    const map: ReadonlyMap<string, number> = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const values: number[] = []
    forEachMap(map, (value) => {
      values.push(value)
    })
    expect(values).toEqual([1, 2])
  })

  it('should allow side effects', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    let sum = 0
    forEachMap(map, (value) => {
      sum += value
    })
    expect(sum).toBe(6)
  })
})
