import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { getHomeDirectory } from './getHomeDirectory'

describe.sequential(getHomeDirectory.name, () => {
  it('gets the os home directory', () => {
    expect(typeof getHomeDirectory()).toBe('string')
  })

  it('should throw when HOME and USERPROFILE are not set', () => {
    const origHome = process.env['HOME']
    const origUserProfile = process.env['USERPROFILE']
    try {
      delete process.env['HOME']
      delete process.env['USERPROFILE']
      expect(() => getHomeDirectory()).toThrow('Home directory not found')
    } finally {
      process.env['HOME'] = origHome
      process.env['USERPROFILE'] = origUserProfile
    }
  })
})
