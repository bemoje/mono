import { describe, expect, it } from 'vitest'
import { camelCase } from './camelCase'

describe(camelCase.name, () => {
  it('should convert a string to camel case', () => {
    const input = 'hello world'
    const expectedOutput = 'helloWorld'
    const result = camelCase(input)
    expect(result).toBe(expectedOutput)
  })

  it('should handle special rules', () => {
    const input = 'special case'
    const specialRules = new Map<string, string>([['special case', 'SPECIALCASE']])
    const expectedOutput = 'SPECIALCASE'
    const result = camelCase(input, specialRules)
    expect(result).toBe(expectedOutput)
  })

  it('should throw an error if camelCase resolves to an empty string', () => {
    const input = '   '
    expect(() => {
      camelCase(input)
    }).toThrow('camelCase resolved to an empty string')
  })
})
