import assert from 'assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { mapMap } from './mapMap'

describe(mapMap.name, () => {
  it('examples', () => {
    expect(() => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const doubled = mapMap(map, (value) => {
        return value * 2
      })
      assert.deepStrictEqual(
        [...doubled],
        [
          ['a', 2],
          ['b', 4],
          ['c', 6],
        ],
        'doubled values'
      )
    }).not.toThrow()
  })

  it('should transform each value', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const result = mapMap(map, (value) => {
      return value * 2
    })
    expect([...result]).toEqual([
      ['a', 2],
      ['b', 4],
      ['c', 6],
    ])
  })

  it('should handle empty map', () => {
    const result = mapMap(new Map(), (value: number) => {
      return value
    })
    expect([...result]).toEqual([])
  })

  it('should support type transformation', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = mapMap(map, (value) => {
      return String(value)
    })
    expect([...result]).toEqual([
      ['a', '1'],
      ['b', '2'],
    ])
  })

  it('should work with ReadonlyMap', () => {
    const map: ReadonlyMap<string, number> = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const result = mapMap(map, (value) => {
      return value * 2
    })
    expect([...result]).toEqual([
      ['a', 2],
      ['b', 4],
    ])
  })

  it('should not mutate original map', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    const original = [...map]
    mapMap(map, (value) => {
      return value * 2
    })
    expect([...map]).toEqual(original)
  })
})
