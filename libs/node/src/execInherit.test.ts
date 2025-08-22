import { describe, expect, it, vi, beforeEach } from 'vitest'
import assert from 'node:assert'
import { execSync } from 'child_process'
import { execInherit } from './execInherit'

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}))

const mockExecSync = vi.mocked(execSync)

describe(execInherit.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', () => {
    expect(() => {
      mockExecSync.mockReturnValue(Buffer.from('success output'))

      // Basic command execution
      const result = execInherit('echo hello')
      assert(result instanceof Promise, 'should return promise')

      // Command that would normally produce output
      const resultWithOutput = execInherit('ls -la')
      assert(resultWithOutput instanceof Promise, 'should handle commands with output')

      // Command with complex arguments
      const resultComplex = execInherit('git commit -m "test message"')
      assert(resultComplex instanceof Promise, 'should handle complex commands')
    }).not.toThrow()
  })

  describe('successful execution', () => {
    it('should execute command with inherited stdio and return output', async () => {
      const expectedOutput = 'Command executed successfully'
      mockExecSync.mockReturnValue(Buffer.from(expectedOutput))

      const result = await execInherit('echo "test"')

      expect(result).toBe(expectedOutput)
      expect(mockExecSync).toHaveBeenCalledWith('echo "test"', { stdio: 'inherit' })
    })

    it('should trim output whitespace', async () => {
      const outputWithSpaces = '  output with spaces  \n\n'
      mockExecSync.mockReturnValue(Buffer.from(outputWithSpaces))

      const result = await execInherit('test command')

      expect(result).toBe('output with spaces')
    })

    it('should handle empty output', async () => {
      mockExecSync.mockReturnValue(Buffer.from(''))

      const result = await execInherit('silent command')

      expect(result).toBe('')
    })

    it('should handle multiline output', async () => {
      const multilineOutput = 'line1\nline2\nline3'
      mockExecSync.mockReturnValue(Buffer.from(multilineOutput))

      const result = await execInherit('multiline command')

      expect(result).toBe(multilineOutput)
    })

    it('should handle null buffer return', async () => {
      mockExecSync.mockReturnValue(null as any)

      const result = await execInherit('null command')

      expect(result).toBe('')
    })

    it('should handle undefined buffer return', async () => {
      mockExecSync.mockReturnValue(undefined as any)

      const result = await execInherit('undefined command')

      expect(result).toBe('')
    })
  })

  describe('error handling', () => {
    it('should reject when execSync throws Error instance', async () => {
      const error = new Error('Command execution failed')
      mockExecSync.mockImplementation(() => {
        throw error
      })

      await expect(execInherit('failing command')).rejects.toThrow('Command execution failed')
    })

    it('should reject when execSync throws string error', async () => {
      const stringError = 'String error message'
      mockExecSync.mockImplementation(() => {
        throw stringError
      })

      await expect(execInherit('failing command')).rejects.toThrow('String error message')
    })

    it('should reject when execSync throws number error', async () => {
      const numberError = 404
      mockExecSync.mockImplementation(() => {
        throw numberError
      })

      await expect(execInherit('failing command')).rejects.toThrow('404')
    })

    it('should reject when execSync throws null', async () => {
      mockExecSync.mockImplementation(() => {
        throw null
      })

      await expect(execInherit('failing command')).rejects.toThrow('null')
    })

    it('should reject when execSync throws undefined', async () => {
      mockExecSync.mockImplementation(() => {
        throw undefined
      })

      await expect(execInherit('failing command')).rejects.toThrow('undefined')
    })

    it('should reject when execSync throws object', async () => {
      const objectError = { code: 'ENOENT', message: 'File not found' }
      mockExecSync.mockImplementation(() => {
        throw objectError
      })

      await expect(execInherit('failing command')).rejects.toThrow('[object Object]')
    })

    it('should wrap non-Error instances in Error objects', async () => {
      const stringError = 'Command not found'
      mockExecSync.mockImplementation(() => {
        throw stringError
      })

      try {
        await execInherit('nonexistent command')
        expect.fail('Should have thrown')
      } catch (caughtError) {
        const error = caughtError as Error
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Command not found')
      }
    })
  })

  describe('stdio inheritance', () => {
    it('should always use stdio inherit option', async () => {
      mockExecSync.mockReturnValue(Buffer.from('test'))

      await execInherit('any command')

      expect(mockExecSync).toHaveBeenCalledWith('any command', { stdio: 'inherit' })
    })

    it('should pass through all output to parent process', async () => {
      // This is implicit in the stdio: 'inherit' option
      mockExecSync.mockReturnValue(Buffer.from('inherited output'))

      const result = await execInherit('command with output')

      expect(result).toBe('inherited output')
      expect(mockExecSync).toHaveBeenCalledWith('command with output', { stdio: 'inherit' })
    })
  })

  describe('command handling', () => {
    it('should handle simple commands', async () => {
      mockExecSync.mockReturnValue(Buffer.from('simple'))

      await execInherit('pwd')

      expect(mockExecSync).toHaveBeenCalledWith('pwd', { stdio: 'inherit' })
    })

    it('should handle commands with arguments', async () => {
      mockExecSync.mockReturnValue(Buffer.from('args'))

      await execInherit('ls -la /tmp')

      expect(mockExecSync).toHaveBeenCalledWith('ls -la /tmp', { stdio: 'inherit' })
    })

    it('should handle commands with pipes', async () => {
      mockExecSync.mockReturnValue(Buffer.from('piped'))

      await execInherit('ps aux | grep node')

      expect(mockExecSync).toHaveBeenCalledWith('ps aux | grep node', { stdio: 'inherit' })
    })

    it('should handle commands with redirections', async () => {
      mockExecSync.mockReturnValue(Buffer.from('redirected'))

      await execInherit('echo "test" > /tmp/output.txt')

      expect(mockExecSync).toHaveBeenCalledWith('echo "test" > /tmp/output.txt', { stdio: 'inherit' })
    })

    it('should handle commands with environment variables', async () => {
      mockExecSync.mockReturnValue(Buffer.from('env'))

      await execInherit('NODE_ENV=production npm start')

      expect(mockExecSync).toHaveBeenCalledWith('NODE_ENV=production npm start', { stdio: 'inherit' })
    })

    it('should handle empty command string', async () => {
      mockExecSync.mockReturnValue(Buffer.from(''))

      const result = await execInherit('')

      expect(result).toBe('')
      expect(mockExecSync).toHaveBeenCalledWith('', { stdio: 'inherit' })
    })

    it('should handle commands with special characters', async () => {
      const specialCommand = 'echo "Hello & World | Test > Output"'
      mockExecSync.mockReturnValue(Buffer.from('special'))

      await execInherit(specialCommand)

      expect(mockExecSync).toHaveBeenCalledWith(specialCommand, { stdio: 'inherit' })
    })

    it('should handle commands with unicode characters', async () => {
      const unicodeCommand = 'echo "Hello 世界 🚀"'
      mockExecSync.mockReturnValue(Buffer.from('unicode'))

      await execInherit(unicodeCommand)

      expect(mockExecSync).toHaveBeenCalledWith(unicodeCommand, { stdio: 'inherit' })
    })
  })

  describe('buffer handling', () => {
    it('should handle buffer with toString method', async () => {
      const buffer = Buffer.from('buffer content')
      mockExecSync.mockReturnValue(buffer)

      const result = await execInherit('test')

      expect(result).toBe('buffer content')
    })

    it('should handle object without toString method', async () => {
      const objectWithoutToString = { data: 'some data' }
      mockExecSync.mockReturnValue(objectWithoutToString as any)

      const result = await execInherit('test')

      expect(result).toBe('[object Object]') // Object.prototype.toString
    })

    it('should handle string return (though unexpected)', async () => {
      mockExecSync.mockReturnValue('direct string' as any)

      const result = await execInherit('test')

      expect(result).toBe('direct string')
    })

    it('should handle number return', async () => {
      mockExecSync.mockReturnValue(42 as any)

      const result = await execInherit('test')

      expect(result).toBe('42')
    })

    it('should handle boolean return', async () => {
      mockExecSync.mockReturnValue(true as any)

      const result = await execInherit('test')

      expect(result).toBe('true')
    })
  })

  describe('promise behavior', () => {
    it('should return a Promise', () => {
      mockExecSync.mockReturnValue(Buffer.from('test'))

      const result = execInherit('test command')

      expect(result).toBeInstanceOf(Promise)
    })

    it('should resolve with string value', async () => {
      const expectedOutput = 'Promise resolved output'
      mockExecSync.mockReturnValue(Buffer.from(expectedOutput))

      const result = await execInherit('test')

      expect(typeof result).toBe('string')
      expect(result).toBe(expectedOutput)
    })

    it('should handle async/await pattern', async () => {
      mockExecSync.mockReturnValue(Buffer.from('async test'))

      const result = await execInherit('async command')

      expect(result).toBe('async test')
    })

    it('should handle .then() pattern', () => {
      mockExecSync.mockReturnValue(Buffer.from('then test'))

      return execInherit('then command').then((result) => {
        expect(result).toBe('then test')
      })
    })

    it('should handle .catch() pattern for errors', () => {
      const error = new Error('Catch test error')
      mockExecSync.mockImplementation(() => {
        throw error
      })

      return execInherit('catch command').catch((caughtError) => {
        expect(caughtError).toBeInstanceOf(Error)
        expect(caughtError.message).toBe('Catch test error')
      })
    })
  })

  describe('real-world command examples', () => {
    it('should handle git commands', async () => {
      mockExecSync.mockReturnValue(Buffer.from('git output'))

      await execInherit('git status --porcelain')

      expect(mockExecSync).toHaveBeenCalledWith('git status --porcelain', { stdio: 'inherit' })
    })

    it('should handle npm commands', async () => {
      mockExecSync.mockReturnValue(Buffer.from('npm output'))

      await execInherit('npm install --save express')

      expect(mockExecSync).toHaveBeenCalledWith('npm install --save express', { stdio: 'inherit' })
    })

    it('should handle docker commands', async () => {
      mockExecSync.mockReturnValue(Buffer.from('docker output'))

      await execInherit('docker run -it ubuntu bash')

      expect(mockExecSync).toHaveBeenCalledWith('docker run -it ubuntu bash', { stdio: 'inherit' })
    })

    it('should handle build commands', async () => {
      mockExecSync.mockReturnValue(Buffer.from('build output'))

      await execInherit('npm run build:production')

      expect(mockExecSync).toHaveBeenCalledWith('npm run build:production', { stdio: 'inherit' })
    })
  })
})
