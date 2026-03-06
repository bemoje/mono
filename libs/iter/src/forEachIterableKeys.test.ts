import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { forEachIterableKeys } from './forEachIterableKeys'
import { it } from 'vitest'

describe(forEachIterableKeys.name, () => {
  it('examples', () => {
    expect(() => {
      // iterate keys
      const entries: Array<[string, number]> = [
        ['apple', 1],
        ['banana', 2],
        ['apricot', 3],
      ]
      const keys: string[] = []
      forEachIterableKeys(entries, (key) => {
        keys.push(key)
      })
      assert.deepStrictEqual(keys, ['apple', 'banana', 'apricot'], 'forEach keys')
    }).not.toThrow()
  })

  it('should execute callback for each key', () => {
    const entries: Array<[string, number]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]
    const keys: string[] = []
    forEachIterableKeys(entries, (key) => {
      keys.push(key)
    })
    expect(keys).toEqual(['a', 'b', 'c'])
  })

  it('should provide both key and value', () => {
    const entries: Array<[string, number]> = [
      ['a', 10],
      ['b', 20],
    ]
    const results: Array<[string, number]> = []
    forEachIterableKeys(entries, (key, value) => {
      results.push([key, value])
    })
    expect(results).toEqual([
      ['a', 10],
      ['b', 20],
    ])
  })

  it('should handle empty iterable', () => {
    let called = false
    forEachIterableKeys([], () => {
      called = true
    })
    expect(called).toBe(false)
  })

  it('should work with Map entries', () => {
    const map = new Map([
      ['x', 100],
      ['y', 200],
    ])
    const keys: string[] = []
    forEachIterableKeys(map, (key) => {
      keys.push(key)
    })
    expect(keys).toEqual(['x', 'y'])
  })

  it('should work with numeric keys', () => {
    const entries: Array<[number, string]> = [
      [1, 'one'],
      [2, 'two'],
    ]
    const keys: number[] = []
    forEachIterableKeys(entries, (key) => {
      keys.push(key)
    })
    expect(keys).toEqual([1, 2])
  })
})
