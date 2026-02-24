import { roundToNearest } from './roundToNearest'
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";

describe('roundToNearest', () => {
  it('should round to the nearest specified number', () => {
    expect(roundToNearest(5, 2)).toBe(6)
    expect(roundToNearest(5, 3)).toBe(6)
    expect(roundToNearest(0, 2)).toBe(0)
    expect(roundToNearest(-5, 2)).toBe(-4)
    expect(roundToNearest(-5, 3)).toBe(-6)
  })
})
