import { describe, expect, it } from 'vitest'
import { assertOptionShortNameIsValid } from './assertOptionShortNameIsValid'

describe(assertOptionShortNameIsValid.name, () => {
  it('should not throw for a single lowercase letter', () => {
    expect(() => assertOptionShortNameIsValid('v')).not.toThrow()
  })

  it('should not throw for a single uppercase letter', () => {
    expect(() => assertOptionShortNameIsValid('V')).not.toThrow()
  })

  it('should not throw for a single digit', () => {
    expect(() => assertOptionShortNameIsValid('1')).not.toThrow()
  })

  it('should throw for multiple characters', () => {
    expect(() => assertOptionShortNameIsValid('ab')).toThrow(
      'Expected short name to be a single alpha-numeric character. Got: ab',
    )
  })

  it('should throw for an empty string', () => {
    expect(() => assertOptionShortNameIsValid('')).toThrow(
      'Expected short name to be a single alpha-numeric character. Got: ',
    )
  })

  it('should throw for a special character', () => {
    expect(() => assertOptionShortNameIsValid('-')).toThrow(
      'Expected short name to be a single alpha-numeric character. Got: -',
    )
  })
})
