import { describe, expect, it } from 'vitest'
import { today } from './today'

describe(today.name, () => {
  it('should return a Date object', () => {
    expect(today()).toBeInstanceOf(Date)
  })
})
