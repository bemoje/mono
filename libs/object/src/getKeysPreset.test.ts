import assert from 'node:assert'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { getKeysPreset } from './getKeysPreset'
import { it } from 'vitest'

describe(getKeysPreset.name, () => {
  it('examples', () => {
    expect(() => {
      const obj = { a: 1, [Symbol('b')]: 2 }
      Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false })

      // Create preset to get only string keys
      const getStringKeys = getKeysPreset({ ignoreSymbols: true })
      const stringKeys = getStringKeys(obj)

      assert(Array.isArray(stringKeys))
      assert(stringKeys.includes('a'))
      assert(
        !stringKeys.some((k) => {
          return typeof k === 'symbol'
        }),
      )
    }).not.toThrow()
  })

  it('should create function that ignores symbols', () => {
    const obj = { a: 1, [Symbol('b')]: 2 }
    const getStringKeys = getKeysPreset({ ignoreSymbols: true })
    const keys = getStringKeys(obj)

    expect(keys).toContain('a')
    expect(
      keys.every((k) => {
        return typeof k === 'string'
      }),
    ).toBe(true)
  })

  it('should create function that ignores strings', () => {
    const sym = Symbol('test')
    const obj = { a: 1, [sym]: 2 }
    const getSymbolKeys = getKeysPreset({ ignoreStrings: true })
    const keys = getSymbolKeys(obj)

    expect(keys).toContain(sym)
    expect(
      keys.every((k) => {
        return typeof k === 'symbol'
      }),
    ).toBe(true)
  })

  it('should create function that ignores non-enumerable properties', () => {
    const obj = { a: 1 }
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false })

    const getEnumerableKeys = getKeysPreset({ ignoreNonEnumerable: true })
    const keys = getEnumerableKeys(obj)

    expect(keys).toContain('a')
    expect(keys).not.toContain('hidden')
  })

  it('should create function that ignores enumerable properties', () => {
    const obj = { a: 1 }
    Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false })

    const getNonEnumerableKeys = getKeysPreset({ ignoreEnumerable: true })
    const keys = getNonEnumerableKeys(obj)

    expect(keys).not.toContain('a')
    expect(keys).toContain('hidden')
  })

  it('should create function that ignores specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const getFilteredKeys = getKeysPreset({ ignore: ['b'] })
    const keys = getFilteredKeys(obj)

    expect(keys).toContain('a')
    expect(keys).toContain('c')
    expect(keys).not.toContain('b')
  })
})
