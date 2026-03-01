import { beforeEach } from 'vitest'
import { clearTerminal } from './clearTerminal'
import { describe } from 'vitest'
import { execSync } from 'child_process'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

// Mock child_process module
vi.mock('child_process', () => {
  return { execSync: vi.fn() }
})

const mockedExecSync = vi.mocked(execSync)

describe(clearTerminal.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      // Clear the terminal
      clearTerminal()
    }).not.toThrow()
  })

  describe('terminal clearing behavior', () => {
    it('should call execSync with correct command and options', () => {
      clearTerminal()

      expect(mockedExecSync).toHaveBeenCalledWith('cls', { stdio: 'inherit' })
      expect(mockedExecSync).toHaveBeenCalledTimes(1)
    })

    it('should use inherit stdio to display output directly', () => {
      clearTerminal()

      const [, options] = mockedExecSync.mock.calls[0]
      expect(options).toEqual({ stdio: 'inherit' })
    })

    it('should handle execSync errors gracefully', () => {
      mockedExecSync.mockImplementationOnce(() => {
        throw new Error('Command failed')
      })

      expect(() => {
        return clearTerminal()
      }).toThrow('Command failed')
    })
  })

  describe('edge cases', () => {
    it('should work when called multiple times in succession', () => {
      clearTerminal()
      clearTerminal()
      clearTerminal()

      expect(mockedExecSync).toHaveBeenCalledTimes(3)
      expect(mockedExecSync).toHaveBeenCalledWith('cls', { stdio: 'inherit' })
    })
  })
})
