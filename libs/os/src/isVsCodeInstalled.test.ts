import { isVsCodeInstalled } from './isVsCodeInstalled'
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";

describe(isVsCodeInstalled.name, () => {
  it('should return a boolean for whether VSCode is installed.', () => {
    expect(typeof isVsCodeInstalled()).toBe('boolean')
  })
})
