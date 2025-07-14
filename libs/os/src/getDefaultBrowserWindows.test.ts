import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { getDefaultBrowserWindows } from './getDefaultBrowserWindows'
import { execSync } from 'child_process'

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}))

const mockExecSync = vi.mocked(execSync)

describe(getDefaultBrowserWindows.name, () => {
  it('examples', () => {
    expect(() => {
      mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    ChromeHTML'))
      const browser = getDefaultBrowserWindows()

      assert.strictEqual(browser.name, 'Chrome', 'browser name')
      assert.strictEqual(browser.run, 'chrome', 'browser run command')
    }).not.toThrow()
  })

  it('should return Chrome browser info when ChromeHTML is found', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    ChromeHTML'))

    const result = getDefaultBrowserWindows()

    expect(result).toEqual({
      name: 'Chrome',
      run: 'chrome',
      id: 'com.google.chrome',
    })
  })

  it('should return Edge browser info when MSEdgeHTM is found', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    MSEdgeHTM'))

    const result = getDefaultBrowserWindows()

    expect(result).toEqual({
      name: 'Edge',
      run: 'msedge',
      id: 'com.microsoft.edge',
    })
  })

  it('should return Firefox browser info when FirefoxURL is found', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    FirefoxURL'))

    const result = getDefaultBrowserWindows()

    expect(result).toEqual({
      name: 'Firefox',
      run: 'firefox',
      id: 'org.mozilla.firefox',
    })
  })

  it('should throw error when no ProgId match is found', () => {
    mockExecSync.mockReturnValue(Buffer.from('Invalid output without ProgId'))

    expect(() => {
      getDefaultBrowserWindows()
    }).toThrow('Cannot find Windows browser in stdout')
  })

  it('should throw error when unknown browser ID is found', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    UnknownBrowserHTML'))

    expect(() => {
      getDefaultBrowserWindows()
    }).toThrow('Unknown browser ID: UnknownBrowserHTML')
  })

  it('should handle Brave browser variants', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    BraveHTML'))

    const result = getDefaultBrowserWindows()

    expect(result).toEqual({
      name: 'Brave',
      run: 'brave',
      id: 'com.brave.Browser',
    })
  })

  it('should handle Internet Explorer', () => {
    mockExecSync.mockReturnValue(Buffer.from('ProgId    REG_SZ    IE.HTTP'))

    const result = getDefaultBrowserWindows()

    expect(result).toEqual({
      name: 'Internet Explorer',
      run: 'iexplore',
      id: 'com.microsoft.ie',
    })
  })
})
