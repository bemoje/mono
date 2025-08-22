import { describe, it, expect } from 'vitest'
import { monthNameDa } from './monthNameDa'

describe(monthNameDa.name, () => {
  it('should return the correct month name for valid month numbers', () => {
    expect(monthNameDa(1)).toBe('Januar')
    expect(monthNameDa(2)).toBe('Februar')
    expect(monthNameDa(3)).toBe('Marts')
    expect(monthNameDa(4)).toBe('April')
    expect(monthNameDa(5)).toBe('Maj')
    expect(monthNameDa(6)).toBe('Juni')
    expect(monthNameDa(7)).toBe('Juli')
    expect(monthNameDa(8)).toBe('August')
    expect(monthNameDa(9)).toBe('September')
    expect(monthNameDa(10)).toBe('Oktober')
    expect(monthNameDa(11)).toBe('November')
    expect(monthNameDa(12)).toBe('December')
  })

  it('should throw an error for invalid month numbers', () => {
    expect(() => monthNameDa(0)).toThrow('Invalid month number. Got: 0')
    expect(() => monthNameDa(13)).toThrow('Invalid month number. Got: 13')
    expect(() => monthNameDa(-1)).toThrow('Invalid month number. Got: -1')
    expect(() => monthNameDa(100)).toThrow('Invalid month number. Got: 100')
  })
})
