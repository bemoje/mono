import { objToMap } from './objToMap'
import { describe, expect, it } from 'vitest'

describe('objToMap', () => {
  it('should convert an object with string keys to a Map', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const expectedMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    expect(objToMap(obj)).toEqual(expectedMap)
  })

  it('should convert an object with number keys to a Map', () => {
    const obj = { 1: 'a', 2: 'b', 3: 'c' }
    const expectedMap = new Map([
      ['1', 'a'],
      ['2', 'b'],
      ['3', 'c'],
    ])

    expect(objToMap(obj)).toEqual(expectedMap)
  })

  it('should convert an empty object to an empty Map', () => {
    const obj = {}
    const expectedMap = new Map()

    expect(objToMap(obj)).toEqual(expectedMap)
  })
})
