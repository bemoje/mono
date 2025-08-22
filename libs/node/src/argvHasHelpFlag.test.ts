import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { argvHasHelpFlag } from './argvHasHelpFlag'

describe(argvHasHelpFlag.name, () => {
  let originalArgv: string[]

  beforeEach(() => {
    originalArgv = [...process.argv]
  })

  afterEach(() => {
    process.argv = originalArgv
  })

  it('examples', () => {
    expect(() => {
      // Basic help flag detection
      const result1 = argvHasHelpFlag(['node', 'script.js', '--help'])
      assert(typeof result1 === 'boolean', 'should return boolean')

      // Short help flag detection
      const result2 = argvHasHelpFlag(['node', 'script.js', '-h'])
      assert(typeof result2 === 'boolean', 'should return boolean')

      // No help flag
      const result3 = argvHasHelpFlag(['node', 'script.js', '--version'])
      assert(result3 === false, 'should return false when no help flag')

      // Using process.argv by default
      process.argv = ['node', 'script.js', '--help']
      const result4 = argvHasHelpFlag()
      assert(typeof result4 === 'boolean', 'should work with process.argv')
    }).not.toThrow()
  })

  describe('help flag detection', () => {
    it('should detect --help flag', () => {
      const args = ['node', 'script.js', '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect -h flag', () => {
      const args = ['node', 'script.js', '-h']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect --help in middle of arguments', () => {
      const args = ['node', 'script.js', '--config', 'file.json', '--help', '--verbose']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect -h in middle of arguments', () => {
      const args = ['node', 'script.js', '--config', 'file.json', '-h', '--verbose']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect help flag at the beginning', () => {
      const args = ['--help', 'node', 'script.js']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should return false when no help flag present', () => {
      const args = ['node', 'script.js', '--version', '--verbose']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })

    it('should return false for empty arguments array', () => {
      const result = argvHasHelpFlag([])

      expect(result).toBe(false)
    })
  })

  describe('process.argv default behavior', () => {
    it('should use process.argv when no arguments provided', () => {
      process.argv = ['node', 'script.js', '--help', '--verbose']

      const result = argvHasHelpFlag()

      expect(result).toBe(true)
    })

    it('should use process.argv and detect -h', () => {
      process.argv = ['node', 'script.js', '-h']

      const result = argvHasHelpFlag()

      expect(result).toBe(true)
    })

    it('should return false when process.argv has no help flag', () => {
      process.argv = ['node', 'script.js', '--version']

      const result = argvHasHelpFlag()

      expect(result).toBe(false)
    })

    it('should handle empty process.argv', () => {
      process.argv = []

      const result = argvHasHelpFlag()

      expect(result).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should not match partial help flags', () => {
      const args = ['node', 'script.js', '--helper', '-help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })

    it('should not match help as part of other arguments', () => {
      const args = ['node', 'script.js', '--config=help', 'help.txt']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })

    it('should not match help with different casing', () => {
      const args = ['node', 'script.js', '--HELP', '-H']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })

    it('should handle arguments with special characters', () => {
      const args = ['node', 'script.js', '--config="help"', '-h']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should handle unicode arguments', () => {
      const args = ['node', 'script.js', '--名前=help', '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should handle very long argument lists', () => {
      const args = ['node', 'script.js']
      for (let i = 0; i < 1000; i++) {
        args.push(`--option${i}`)
      }
      args.push('--help')

      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should handle null/undefined values in arguments', () => {
      const args = ['node', 'script.js', null as any, undefined as any, '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should handle empty string arguments', () => {
      const args = ['node', 'script.js', '', '--help', '']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })
  })

  describe('multiple help flags', () => {
    it('should detect when both --help and -h are present', () => {
      const args = ['node', 'script.js', '--help', '-h']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect multiple --help flags', () => {
      const args = ['node', 'script.js', '--help', '--config', 'file.json', '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect multiple -h flags', () => {
      const args = ['node', 'script.js', '-h', '--config', 'file.json', '-h']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })
  })

  describe('real-world argument patterns', () => {
    it('should detect help in npm-style commands', () => {
      const args = ['node', '/usr/local/bin/npm', 'install', '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should detect help in git-style commands', () => {
      const args = ['node', 'git-wrapper.js', 'commit', '-h']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should work with CLI tools', () => {
      const args = ['node', 'dist/cli.js', '--config', './config.json', '--verbose', '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should work with complex flag combinations', () => {
      const args = [
        'node',
        'script.js',
        '--input',
        'file.txt',
        '--output',
        'result.txt',
        '--format',
        'json',
        '-v',
        '--help',
        '--dry-run',
      ]
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should return false for version-only commands', () => {
      const args = ['node', 'script.js', '--version', '-v']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })

    it('should return false for config-only commands', () => {
      const args = ['node', 'script.js', '--config', 'app.json', '--env', 'production']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(false)
    })
  })

  describe('array methods behavior', () => {
    it('should use array.find method correctly', () => {
      const findSpy = vi.spyOn(Array.prototype, 'find')
      const args = ['node', 'script.js', '--help']

      argvHasHelpFlag(args)

      expect(findSpy).toHaveBeenCalled()
      findSpy.mockRestore()
    })

    it('should handle arrays with non-string elements gracefully', () => {
      const args = ['node', 'script.js', 123 as any, true as any, '--help']
      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })

    it('should handle sparse arrays', () => {
      const args = new Array(5)
      args[0] = 'node'
      args[1] = 'script.js'
      args[4] = '--help'

      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
    })
  })

  describe('performance considerations', () => {
    it('should stop searching after finding first match', () => {
      const findSpy = vi.spyOn(Array.prototype, 'find')
      const args = ['node', 'script.js', '--help', '--config', '--help', '-h']

      const result = argvHasHelpFlag(args)

      expect(result).toBe(true)
      // find() should stop at first match
      expect(findSpy).toHaveBeenCalledTimes(1)
      findSpy.mockRestore()
    })

    it('should handle very large argument arrays efficiently', () => {
      const largeArgs = ['node', 'script.js']
      for (let i = 0; i < 10000; i++) {
        largeArgs.push(`--option${i}`)
      }
      largeArgs.push('--help') // Add at the end

      const start = Date.now()
      const result = argvHasHelpFlag(largeArgs)
      const end = Date.now()

      expect(result).toBe(true)
      expect(end - start).toBeLessThan(100) // Should complete quickly
    })
  })

  describe('type safety', () => {
    it('should handle undefined input gracefully', () => {
      const result = argvHasHelpFlag(undefined as any)

      expect(result).toBe(false)
    })

    it('should handle null input gracefully', () => {
      expect(() => argvHasHelpFlag(null as any)).toThrow()
    })

    it('should handle non-array input gracefully', () => {
      expect(() => argvHasHelpFlag('not an array' as any)).toThrow()
    })
  })
})
