import { describe, expect, it } from 'vitest'
import { expectType } from 'tsd'
import { ExtMap } from './ExtMap'
import { mapUpdate } from './mapUpdate'
import { mapGetOrDefault } from './mapGetOrDefault'
import { keysArray } from './keysArray'
import { valuesArray } from './valuesArray'
import { entriesArray } from './entriesArray'
import { toMap } from './toMap'

describe('ExtMap type compatibility', () => {
  it('should have type-compatible methods with utility functions', () => {
    const map = new ExtMap<string, number>()

    // Test load method compatibility
    const loadResult = map.load([['a', 1]])
    expectType<ExtMap<string, number>>(loadResult)
    expect(loadResult).toBe(map) // Should return this for chaining
    expect(loadResult).toBeInstanceOf(ExtMap)

    // Test sort methods compatibility
    const sortResult = map.sort(([k1, v1], [k2, v2]) => k1.localeCompare(k2))
    expectType<ExtMap<string, number>>(sortResult)
    expect(sortResult).toBe(map) // Should return this for chaining
    expect(sortResult).toBeInstanceOf(ExtMap)

    const sortByKeysResult = map.sortByKeys((a, b) => a.localeCompare(b))
    expectType<ExtMap<string, number>>(sortByKeysResult)
    expect(sortByKeysResult).toBe(map) // Should return this for chaining
    expect(sortByKeysResult).toBeInstanceOf(ExtMap)

    const sortByValuesResult = map.sortByValues((a, b) => a - b)
    expectType<ExtMap<string, number>>(sortByValuesResult)
    expect(sortByValuesResult).toBe(map) // Should return this for chaining
    expect(sortByValuesResult).toBeInstanceOf(ExtMap)

    const reverseResult = map.reverse()
    expectType<ExtMap<string, number>>(reverseResult)
    expect(reverseResult).toBe(map) // Should return this for chaining
    expect(reverseResult).toBeInstanceOf(ExtMap)

    // Test update method compatibility - NOTE: Different return types!
    // Interface returns this, utility returns the value
    const updateResult = map.update('key', (v) => v ?? 0)
    expectType<ExtMap<string, number>>(updateResult)
    expect(updateResult).toBe(map) // Should return this for chaining
    expect(updateResult).toBeInstanceOf(ExtMap)

    // Test getOrDefault method compatibility
    const getOrDefaultResult = map.getOrDefault('key', () => 42)
    expectType<number>(getOrDefaultResult)
    expect(typeof getOrDefaultResult).toBe('number')
    expect(getOrDefaultResult).toBe(0) // Should return the existing value since key exists

    // Test getOrDefault with non-existent key
    const defaultValueResult = map.getOrDefault('nonexistent', () => 42)
    expectType<number>(defaultValueResult)
    expect(typeof defaultValueResult).toBe('number')
    expect(defaultValueResult).toBe(42) // Should return the default value

    const utilGetOrDefaultResult = mapGetOrDefault(map, 'key2', () => 123)
    expectType<number>(utilGetOrDefaultResult)
    expect(typeof utilGetOrDefaultResult).toBe('number')
    expect(utilGetOrDefaultResult).toBe(123) // Should return the default value

    // Test array methods compatibility
    const keysArrayResult = map.keysArray()
    expectType<string[]>(keysArrayResult)
    expect(Array.isArray(keysArrayResult)).toBe(true)
    expect(keysArrayResult.every((k) => typeof k === 'string')).toBe(true)

    const utilKeysArrayResult = keysArray(map)
    expectType<string[]>(utilKeysArrayResult)
    expect(Array.isArray(utilKeysArrayResult)).toBe(true)
    expect(utilKeysArrayResult.every((k) => typeof k === 'string')).toBe(true)

    const valuesArrayResult = map.valuesArray()
    expectType<number[]>(valuesArrayResult)
    expect(Array.isArray(valuesArrayResult)).toBe(true)
    expect(valuesArrayResult.every((v) => typeof v === 'number')).toBe(true)

    const utilValuesArrayResult = valuesArray(map)
    expectType<number[]>(utilValuesArrayResult) // Type issue: returns unknown[]
    expect(Array.isArray(utilValuesArrayResult)).toBe(true)
    expect(utilValuesArrayResult.every((v) => typeof v === 'number')).toBe(true)

    const entriesArrayResult = map.entriesArray()
    expectType<[string, number][]>(entriesArrayResult)
    expect(Array.isArray(entriesArrayResult)).toBe(true)
    expect(entriesArrayResult.length).not.toBe(0)

    const utilEntriesArrayResult = entriesArray(map)
    expectType<[string, number][]>(utilEntriesArrayResult)
    expect(Array.isArray(utilEntriesArrayResult)).toBe(true)
    expect(entriesArrayResult.length).not.toBe(0)

    const toMapResult = map.toMap()
    expectType<Map<string, number>>(toMapResult)
    expect(toMapResult).toBeInstanceOf(Map)
    expect(toMapResult).not.toBeInstanceOf(ExtMap)

    const utilToMapResult = toMap(map)
    expectType<Map<string, number>>(utilToMapResult)
    expect(utilToMapResult).toBeInstanceOf(Map)
    expect(utilToMapResult).not.toBeInstanceOf(ExtMap) // Should be native Map, not ExtMap
    // Runtime check that the map contains the correct types
    for (const [key, value] of utilToMapResult) {
      expect(typeof key === 'string' || typeof key === 'number').toBe(true)
      expect(typeof value === 'number' || typeof value === 'string').toBe(true)
    }
  })

  it('should identify the update method return type discrepancy', () => {
    const map = new ExtMap<string, number>()

    // The interface says update returns this for chaining
    const chainResult = map.update('key', (v) => v ?? 0)
    expectType<ExtMap<string, number>>(chainResult)
    expect(chainResult).toBe(map)

    const retval = mapUpdate(map, 'key', (v) => v ?? 0)
    expect(typeof map.get('key')).toBe('number')
    expect(retval).toBe(map)
  })
})
