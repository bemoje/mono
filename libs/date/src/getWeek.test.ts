import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { getWeek } from './getWeek'

describe(getWeek.name, () => {
  it('should get correct week', () => {
    const date = new Date('2001-01-01')
    expect(getWeek(date)).toBe(1)
  })
})
