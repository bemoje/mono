import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { yesterday } from './yesterday'

describe(yesterday.name, () => {
  it('should return a Date object', () => {
    expect(yesterday()).toBeInstanceOf(Date)
  })
})
