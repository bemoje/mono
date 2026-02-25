import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { monthNameDa } from './monthNameDa'
import { monthNameDaRelative } from './monthNameDaRelative'

describe(monthNameDaRelative.name, () => {
  it('should return the correct month name for the current month', () => {
    const currentMonth = new Date().getUTCMonth() + 1
    expect(monthNameDaRelative(0)).toBe(monthNameDa(currentMonth))
  })
})
