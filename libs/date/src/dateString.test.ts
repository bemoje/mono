import { describe, expect, it } from 'vitest'
import { dateString } from './dateString'

describe(dateString.name, () => {
  const testDateString = '2000-01-01'
  const testDate = new Date(testDateString)
  const testTimestamp = testDate.getTime()

  it('should use time now as argument default', () => {
    const isDateString = (v: string) => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v)
    expect(isDateString(dateString())).toBe(true)
  })
  it('should accept Date argument', () => {
    expect(dateString(testDate)).toBe(testDateString)
  })
  it('should accept string argument', () => {
    expect(dateString(testDateString)).toBe(testDateString)
  })
  it('should accept integer argument', () => {
    expect(dateString(testTimestamp)).toBe(testDateString)
  })
})
