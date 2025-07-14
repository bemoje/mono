import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { GetKeysPreset } from './getKeysPreset'

describe(GetKeysPreset.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, [Symbol('b')]: 2 }
      Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false })

      // Create preset to get only string keys
      const getStringKeys = GetKeysPreset({ ignoreSymbols: true })
      const stringKeys = getStringKeys(obj)

      assert(Array.isArray(stringKeys))
      assert(stringKeys.includes('a'))
      assert(!stringKeys.some((k) => typeof k === 'symbol'))
    }).not.toThrow()
  })

  it('should create function that ignores symbols', () => {
    const obj = { a: 1, [Symbol('b')]: 2 }
    const getStringKeys = GetKeysPreset({ ignoreSymbols: true })
    const keys = getStringKeys(obj)

    expect(keys).toContain('a')
    expect(keys.every((k) => typeof k === 'string')).toBe(true)
  })

  it('should create function that ignores strings', () => {
    const sym = Symbol('test')
    const obj = { a: 1, [sym]: 2 }
    const getSymbolKeys = GetKeysPreset({ ignoreStrings: true })
    const keys = getSymbolKeys(obj)

    expect(keys).toContain(sym)
    expect(keys.every((k) => typeof k === 'symbol')).toBe(true)
  })

  it('should create function that ignores non-enumerable properties', () => {
    const obj = { a: 1 }
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false })

    const getEnumerableKeys = GetKeysPreset({ ignoreNonEnumerable: true })
    const keys = getEnumerableKeys(obj)

    expect(keys).toContain('a')
    expect(keys).not.toContain('hidden')
  })

  it('should create function that ignores enumerable properties', () => {
    const obj = { a: 1 }
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false })

    const getNonEnumerableKeys = GetKeysPreset({ ignoreEnumerable: true })
    const keys = getNonEnumerableKeys(obj)

    expect(keys).not.toContain('a')
    expect(keys).toContain('hidden')
  })

  it('should create function that ignores specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const getFilteredKeys = GetKeysPreset({ ignore: ['b'] })
    const keys = getFilteredKeys(obj)

    expect(keys).toContain('a')
    expect(keys).toContain('c')
    expect(keys).not.toContain('b')
  })
})
