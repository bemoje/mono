import { describe, expect, it } from 'vitest'
import { GetKeysPreset } from './getKeysPreset'
import { getKeys } from './getKeys'

describe(getKeys.name, () => {
  it('GetKeys', () => {
    expect(typeof GetKeysPreset({})).toBe('function')
  })

  const enumKey = 'enum'
  const nonEnumKey = 'nonEnum'
  const enumSym = Symbol('enum')
  const nonEnumSym = Symbol('nonEnum')
  const obj = {
    [enumKey]: true,
    [nonEnumKey]: true,
    [enumSym]: true,
    [nonEnumSym]: true,
  }
  Object.defineProperty(obj, nonEnumKey, { enumerable: false })
  Object.defineProperty(obj, nonEnumSym, { enumerable: false })

  it('should return all keys', () => {
    expect(getKeys(obj, {})).toEqual([
      enumKey, //
      nonEnumKey,
      enumSym,
      nonEnumSym,
    ])
  })

  it('should ignore enumerable keys', () => {
    expect(getKeys(obj, { ignoreEnumerable: true })).toEqual([
      nonEnumKey, //
      nonEnumSym,
    ])
  })

  it('should ignore non-enumerable keys', () => {
    expect(getKeys(obj, { ignoreNonEnumerable: true })).toEqual([
      enumKey, //
      enumSym,
    ])
  })

  it('should ignore string keys', () => {
    expect(getKeys(obj, { ignoreStrings: true })).toEqual([
      enumSym, //
      nonEnumSym,
    ])
  })

  it('should ignore symbol keys', () => {
    expect(getKeys(obj, { ignoreSymbols: true })).toEqual([
      enumKey, //
      nonEnumKey,
    ])
  })

  it('should ignore specified keys', () => {
    expect(getKeys(obj, { ignore: [enumKey, nonEnumSym] })).toEqual([
      nonEnumKey, //
      enumSym,
    ])
  })

  it('should ignore enum & symbol keys', () => {
    expect(getKeys(obj, { ignoreEnumerable: true, ignoreSymbols: true })).toEqual([
      nonEnumKey, //
    ])
  })

  it('should ignore non-enum & symbol keys', () => {
    expect(getKeys(obj, { ignoreNonEnumerable: true, ignoreSymbols: true })).toEqual([
      enumKey, //
    ])
  })

  it('should ignore enum & string keys', () => {
    expect(getKeys(obj, { ignoreEnumerable: true, ignoreStrings: true })).toEqual([
      nonEnumSym, //
    ])
  })

  it('should ignore non-enum & string keys', () => {
    expect(getKeys(obj, { ignoreNonEnumerable: true, ignoreStrings: true })).toEqual([
      enumSym, //
    ])
  })
})
