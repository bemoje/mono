import os from 'node:os'
import { afterEach } from "vitest";
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { vi } from "vitest";
import { getAppDataPath } from './getAppDataPath'

vi.mock('./getOS', () => ({ getOS: vi.fn(() => 'windows') }))

import { getOS } from './getOS'
const getOSMock = vi.mocked(getOS)

describe(getAppDataPath.name, () => {
  const originalAppData = process.env['APPDATA']

  afterEach(() => {
    process.env['APPDATA'] = originalAppData
    getOSMock.mockReturnValue('windows')
    vi.restoreAllMocks()
  })

  it('returns an appdata path', () => {
    expect(typeof getAppDataPath()).toBe('string')
    expect(getAppDataPath('myapp').endsWith('myapp')).toBe(true)
    expect(getAppDataPath('myapp', 'dir').endsWith('dir')).toBe(true)
  })

  describe('when APPDATA env is not set', () => {
    it('should resolve windows path', () => {
      delete process.env['APPDATA']
      getOSMock.mockReturnValue('windows')
      const result = getAppDataPath()
      expect(result).toContain('AppData')
    })

    it('should resolve osx path', () => {
      delete process.env['APPDATA']
      getOSMock.mockReturnValue('osx')
      const result = getAppDataPath()
      expect(result).toContain('Application Support')
    })

    it('should resolve linux path', () => {
      delete process.env['APPDATA']
      getOSMock.mockReturnValue('linux')
      const result = getAppDataPath()
      expect(result).toContain('.config')
    })

    it('should throw for unknown OS', () => {
      delete process.env['APPDATA']
      getOSMock.mockReturnValue('unknown')
      expect(() => getAppDataPath()).toThrow('Could not find an appropriate app data path')
    })
  })

  it('should handle paths[0] equal to homedir', () => {
    const homedir = os.homedir()
    const result = getAppDataPath(homedir, 'sub')
    expect(result).toContain('sub')
  })
})
