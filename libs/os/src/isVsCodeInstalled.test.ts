import { isVsCodeInstalled } from './isVsCodeInstalled'
import { describe, expect, it } from 'vitest'

describe(isVsCodeInstalled.name, () => {
  it('should return a boolean for whether VSCode is installed.', () => {
    expect(typeof isVsCodeInstalled()).toBe('boolean')
  })
})
