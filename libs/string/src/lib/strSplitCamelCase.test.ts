import { strSplitCamelCase } from './strSplitCamelCase'
import { describe, expect, it } from 'vitest'

describe('strSplitCamelCase', () => {
  it('example', () => {
    expect(strSplitCamelCase('someCamelCase')).toStrictEqual(['some', 'Camel', 'Case'])
  })

  it('handles numbers', () => {
    expect(strSplitCamelCase('camelCase18')).toStrictEqual(['camel', 'Case18'])
    expect(strSplitCamelCase('camel18Case')).toStrictEqual(['camel18', 'Case'])
    expect(strSplitCamelCase('camel18case')).toStrictEqual(['camel18case'])
  })

  it('should handle empty strings', () => {
    expect(strSplitCamelCase('')).toEqual([])
  })

  it('should handle strings with only one character', () => {
    expect(strSplitCamelCase('a')).toEqual(['a'])
    expect(strSplitCamelCase('A')).toEqual(['A'])
  })

  it('should not split words with only two characters', () => {
    expect(strSplitCamelCase('ab')).toEqual(['ab'])
    expect(strSplitCamelCase('aB')).toEqual(['aB'])
    expect(strSplitCamelCase('bA')).toEqual(['bA'])
  })

  it('handles short strings', () => {
    expect(strSplitCamelCase('aWo')).toStrictEqual(['a', 'Wo'])
    expect(strSplitCamelCase('aaWo')).toStrictEqual(['aa', 'Wo'])
    expect(strSplitCamelCase('aaaW')).toStrictEqual(['aaa', 'W'])
  })

  it('should split camel case words correctly', () => {
    expect(strSplitCamelCase('camelCaseWord')).toEqual(['camel', 'Case', 'Word'])
    expect(strSplitCamelCase('anotherCamelCaseWord')).toEqual(['another', 'Camel', 'Case', 'Word'])
  })

  it('should return the word as it was if no splits needed', () => {
    expect(strSplitCamelCase('word')).toEqual(['word'])
    expect(strSplitCamelCase('anotherword')).toEqual(['anotherword'])
  })

  it('should handle strings with numeric characters', () => {
    expect(strSplitCamelCase('camelCase1Word')).toEqual(['camel', 'Case1', 'Word'])
    expect(strSplitCamelCase('anotherCamelCase2Word')).toEqual(['another', 'Camel', 'Case2', 'Word'])
  })

  it('should handle strings with special characters', () => {
    expect(strSplitCamelCase('camelCase$Word')).toEqual(['camel', 'Case$', 'Word'])
    expect(strSplitCamelCase('anotherCamelCase#Word')).toEqual(['another', 'Camel', 'Case#', 'Word'])
  })
})
