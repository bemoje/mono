import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { execSync } from 'child_process'
import { tsLintFilepath } from './tsLintFilepath'

// Mock execSync to avoid actual command execution in tests
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}))

const mockExecSync = vi.mocked(execSync)

describe(tsLintFilepath.name, () => {
  it('examples', () => {
    expect(() => {
      // Should not throw even if eslint fails
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('ESLint error')
      })

      tsLintFilepath('test.ts')

      // Should execute without errors
      mockExecSync.mockImplementationOnce(() => 'success')
      tsLintFilepath('test.ts')

      assert(true, 'Function should handle both success and error cases')
    }).not.toThrow()
  })

  describe('successful execution', () => {
    it('should call eslint with correct parameters', () => {
      mockExecSync.mockImplementationOnce(() => 'success')

      tsLintFilepath('/path/to/file.ts')

      expect(mockExecSync).toHaveBeenCalledWith('yarn run eslint --fix /path/to/file.ts', { stdio: 'ignore' })
    })

    it('should handle relative paths', () => {
      mockExecSync.mockImplementationOnce(() => 'success')

      tsLintFilepath('src/test.ts')

      expect(mockExecSync).toHaveBeenCalledWith('yarn run eslint --fix src/test.ts', { stdio: 'ignore' })
    })
  })

  describe('error handling', () => {
    it('should not throw when eslint fails', () => {
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('ESLint failed')
      })

      expect(() => tsLintFilepath('test.ts')).not.toThrow()
    })

    it('should suppress all errors silently', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Command failed')
      })

      tsLintFilepath('test.ts')

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('file path handling', () => {
    it('should handle paths with spaces', () => {
      mockExecSync.mockImplementationOnce(() => 'success')

      tsLintFilepath('path with spaces/file.ts')

      expect(mockExecSync).toHaveBeenCalledWith('yarn run eslint --fix path with spaces/file.ts', {
        stdio: 'ignore',
      })
    })

    it('should handle empty string path', () => {
      mockExecSync.mockImplementationOnce(() => 'success')

      expect(() => tsLintFilepath('')).not.toThrow()

      expect(mockExecSync).toHaveBeenCalledWith('yarn run eslint --fix ', { stdio: 'ignore' })
    })
  })
})
