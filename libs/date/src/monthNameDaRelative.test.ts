import { describe, it, expect } from 'vitest'
import { monthNameDaRelative } from './monthNameDaRelative'
import { monthNameDa } from './monthNameDa'

describe(monthNameDaRelative.name, () => {
  it('should return the correct month name for the current month', () => {
    const currentMonth = new Date().getUTCMonth() + 1
    expect(monthNameDaRelative(0)).toBe(monthNameDa(currentMonth))
  })
})
