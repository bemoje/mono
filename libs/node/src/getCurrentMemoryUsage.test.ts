import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { getCurrentMemoryUsage } from './getCurrentMemoryUsage'

describe(getCurrentMemoryUsage.name, () => {
  it('should ', () => {
    expect(getCurrentMemoryUsage()).toBeTypeOf('number')
  })
})
