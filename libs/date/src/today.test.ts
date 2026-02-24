import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { today } from './today'

describe(today.name, () => {
  it('should return a Date object', () => {
    expect(today()).toBeInstanceOf(Date)
  })
})
