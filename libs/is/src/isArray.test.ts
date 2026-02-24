import { isArray } from './isArray'
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";

describe(isArray.name, () => {
  it('should be Array.isArray', () => {
    expect(isArray).toBe(Array.isArray)
  })
})
