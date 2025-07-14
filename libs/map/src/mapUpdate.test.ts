import { describe, expect, it, vitest } from 'vitest'
import { mapUpdate } from './mapUpdate'

describe(mapUpdate.name, () => {
  it('should update the value for the given key in the map', () => {
    const map = new Map<string, number>()
    map.set('key1', 1)
    const fun = (value: number | undefined) => (value ? value + 1 : 1)
    const result = mapUpdate(map, 'key1', fun)
    expect(result).toBe(map)
    expect(map.get('key1')).toBe(2)
  })

  it('should call the function with undefined as the value if the key does not exist', () => {
    const map = new Map<string, number>()
    const fun = vitest.fn((value: number | undefined) => (value ? value + 1 : 1))
    mapUpdate(map, 'key1', fun)
    expect(fun).toHaveBeenCalledWith(undefined, 'key1', map)
  })

  it('should add the key to the map if it does not exist', () => {
    const map = new Map<string, number>()
    const fun = (value: number | undefined) => (value ? value + 1 : 1)
    mapUpdate(map, 'key1', fun)
    expect(map.has('key1')).toBe(true)
  })

  it('should return the map', () => {
    const map = new Map<string, number>()
    const fun = (value: number | undefined) => (value ? value + 1 : 1)
    const result = mapUpdate(map, 'key1', fun)
    expect(map.get('key1')).toBe(1)
    expect(result).toBe(map)
  })
})
