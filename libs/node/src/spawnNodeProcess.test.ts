import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { spawnNodeProcess } from './spawnNodeProcess'
import { spawnChildProcess } from './spawnChildProcess'

// Mock the spawnChildProcess function
vi.mock('./spawnChildProcess', () => ({
  spawnChildProcess: vi.fn(),
}))

const mockSpawnChildProcess = vi.mocked(spawnChildProcess)

describe(spawnNodeProcess.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('examples', async () => {
    expect(() => {
      mockSpawnChildProcess.mockResolvedValue(0)

      // Basic node process spawn
      const result = spawnNodeProcess()
      assert(result instanceof Promise, 'should return promise')

      // Node process with arguments
      const resultWithArgs = spawnNodeProcess(['--version'])
      assert(resultWithArgs instanceof Promise, 'should handle arguments')

      // Node process with spawn options
      const resultWithOptions = spawnNodeProcess([], { cwd: '/tmp' })
      assert(resultWithOptions instanceof Promise, 'should handle spawn options')

      // Node process with callback
      const resultWithCallback = spawnNodeProcess([], {}, (child) => {
        // Callback to access child process
      })
      assert(resultWithCallback instanceof Promise, 'should handle callback')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should spawn node process with default arguments', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)

      const result = spawnNodeProcess()

      expect(result).toBeInstanceOf(Promise)
      expect(mockSpawnChildProcess).toHaveBeenCalledWith(
        expect.any(String), // node executable path
        [],
        {},
        undefined,
      )

      const exitCode = await result
      expect(exitCode).toBe(0)
    })

    it('should spawn node process with custom arguments', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const args = ['--version', '--help']

      await spawnNodeProcess(args)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), args, {}, undefined)
    })

    it('should spawn node process with spawn options', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const spawnOptions = { cwd: '/custom/path', env: { NODE_ENV: 'test' } }

      await spawnNodeProcess([], spawnOptions)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], spawnOptions, undefined)
    })

    it('should spawn node process with emitter callback', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const callback = vi.fn()

      await spawnNodeProcess([], {}, callback)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, callback)
    })

    it('should spawn node process with all parameters', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const args = ['script.js', '--arg1', 'value1']
      const spawnOptions = { cwd: '/app', stdio: 'pipe' as const }
      const callback = vi.fn()

      await spawnNodeProcess(args, spawnOptions, callback)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), args, spawnOptions, callback)
    })
  })

  describe('node executable path', () => {
    let originalPlatform: string
    let originalExecPath: string
    let originalArgv: string[]

    beforeEach(() => {
      originalPlatform = process.platform
      originalExecPath = process.execPath
      originalArgv = [...process.argv]
    })

    afterEach(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
        writable: true,
      })
      Object.defineProperty(process, 'execPath', {
        value: originalExecPath,
        writable: true,
      })
      Object.defineProperty(process, 'argv', {
        value: originalArgv,
        writable: true,
      })
    })

    it('should use process.execPath on Windows', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
      })
      Object.defineProperty(process, 'execPath', {
        value: 'C:\\Program Files\\nodejs\\node.exe',
        writable: true,
      })

      await spawnNodeProcess()

      expect(mockSpawnChildProcess).toHaveBeenCalledWith('C:\\Program Files\\nodejs\\node.exe', [], {}, undefined)
    })

    it('should use process.argv[0] on non-Windows platforms', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
      })
      Object.defineProperty(process, 'argv', {
        value: ['/usr/bin/node', 'script.js'],
        writable: true,
      })

      await spawnNodeProcess()

      expect(mockSpawnChildProcess).toHaveBeenCalledWith('/usr/bin/node', [], {}, undefined)
    })

    it('should use process.argv[0] on macOS', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
        writable: true,
      })
      Object.defineProperty(process, 'argv', {
        value: ['/usr/local/bin/node', 'app.js'],
        writable: true,
      })

      await spawnNodeProcess()

      expect(mockSpawnChildProcess).toHaveBeenCalledWith('/usr/local/bin/node', [], {}, undefined)
    })
  })

  describe('argument handling', () => {
    it('should not modify original arguments array', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const originalArgs = ['--version', '--help']
      const argsCopy = [...originalArgs]

      await spawnNodeProcess(originalArgs)

      expect(originalArgs).toEqual(argsCopy)
    })

    it('should handle empty arguments array', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)

      await spawnNodeProcess([])

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, undefined)
    })

    it('should handle undefined arguments', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)

      await spawnNodeProcess(undefined)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, undefined)
    })
  })

  describe('error handling', () => {
    it('should propagate errors from spawnChildProcess', async () => {
      const error = new Error('Spawn failed')
      mockSpawnChildProcess.mockRejectedValue(error)

      await expect(spawnNodeProcess()).rejects.toThrow('Spawn failed')
    })

    it('should propagate non-zero exit codes', async () => {
      mockSpawnChildProcess.mockResolvedValue(1)

      const exitCode = await spawnNodeProcess()
      expect(exitCode).toBe(1)
    })
  })

  describe('callback functionality', () => {
    it('should pass callback to spawnChildProcess', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const mockCallback = vi.fn()

      await spawnNodeProcess([], {}, mockCallback)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, mockCallback)
    })

    it('should work without callback', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)

      await spawnNodeProcess()

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, undefined)
    })
  })

  describe('spawn options', () => {
    it('should handle complex spawn options', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)
      const complexOptions = {
        cwd: '/custom/working/directory',
        env: { NODE_ENV: 'production', DEBUG: 'app:*' },
        stdio: 'pipe' as const,
        detached: true,
        uid: 1000,
        gid: 1000,
      }

      await spawnNodeProcess(['app.js'], complexOptions)

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), ['app.js'], complexOptions, undefined)
    })

    it('should handle empty spawn options', async () => {
      mockSpawnChildProcess.mockResolvedValue(0)

      await spawnNodeProcess([], {})

      expect(mockSpawnChildProcess).toHaveBeenCalledWith(expect.any(String), [], {}, undefined)
    })
  })
})
