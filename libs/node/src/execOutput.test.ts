import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { execOutput } from './execOutput'
import { exec, ExecException } from 'child_process'

vi.mock('child_process', () => ({
  exec: vi.fn(),
}))

describe('execOutput', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  type execCallback = (error: ExecException | null, stdout: string, stderr: string) => void

  it('should resolve with stdout and stderr when command executes successfully', async () => {
    const mock = vi.mocked(exec).mockImplementation(
      vi.fn((_: string, cb?: execCallback) => {
        if (cb) cb(null, 'out', '')
      }) as never,
    )
    const { stdout, stderr } = await execOutput('some command')
    expect(mock).toBeCalledTimes(1)
    expect(stdout).toBe('out')
    expect(stderr).toBe(undefined)
  })

  it('should resolve, not reject on error', async () => {
    const mock = vi.mocked(exec).mockImplementation(
      vi.fn((_: string, cb?: execCallback) => {
        if (cb) cb(new Error('oops'), '', 'error happened')
      }) as never,
    )
    const { stdout, stderr } = await execOutput('some command')
    expect(mock).toBeCalledTimes(1)
    expect(stdout).toBe('')
    expect(stderr).toBe('error happened')
  })

  it('should use error.message instead of stderr when stderr is empty', async () => {
    const mock = vi.mocked(exec).mockImplementation(
      vi.fn((_: string, cb?: execCallback) => {
        if (cb) cb(new Error('oops'), '', '')
      }) as never,
    )
    const { stdout, stderr } = await execOutput('some command')
    expect(mock).toBeCalledTimes(1)
    expect(stdout).toBe('')
    expect(stderr).toBe('oops')
  })
})
