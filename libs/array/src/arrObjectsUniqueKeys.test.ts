import { describe, expect, it } from 'vitest'
import { arrObjectsUniqueKeys } from './arrObjectsUniqueKeys'

describe('arrObjectsUniqueKeys', () => {
  it('should return an empty array if the input array is empty', () => {
    const result = arrObjectsUniqueKeys([])
    expect(result).toEqual([])
  })

  it('should return an array of unique keys from the objects', () => {
    const result = arrObjectsUniqueKeys([
      { key1: 'value1', key2: 'value2' },
      { key2: 'value3', key3: 'value4' },
      { key4: 'value5' },
    ])
    expect(result).toEqual(['key1', 'key2', 'key3', 'key4'])
  })

  it('should return an array of unique keys even if some objects have the same keys', () => {
    const result = arrObjectsUniqueKeys([
      { key1: 'value1', key2: 'value2' },
      { key2: 'value3', key3: 'value4' },
      { key1: 'value5' },
    ])
    expect(result).toEqual(['key1', 'key2', 'key3'])
  })

  it('should return an array of unique keys even if some objects have no keys', () => {
    const result = arrObjectsUniqueKeys([{ key1: 'value1', key2: 'value2' }, {}, { key3: 'value4' }])
    expect(result).toEqual(['key1', 'key2', 'key3'])
  })
})
