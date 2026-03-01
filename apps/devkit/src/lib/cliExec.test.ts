import { beforeEach } from 'vitest'
import { cliExecSync } from './cliExec'
import { describe } from 'vitest'
import { execSync } from 'child_process'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

vi.mock('child_process', () => {
  return { execSync: vi.fn() }
})

describe(cliExecSync.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should execute a command with inherited stdio by default', () => {
    cliExecSync('echo hello')
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'inherit', cwd: process.cwd() })
  })

  it('should use ignore stdio when quiet is true', () => {
    cliExecSync('echo hello', { quiet: true })
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'ignore', cwd: process.cwd() })
  })

  it('should use provided cwd', () => {
    cliExecSync('echo hello', { cwd: '/some/path' })
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'inherit', cwd: '/some/path' })
  })

  it('should skip execution and log when dryRun is true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    cliExecSync('echo hello', { dryRun: true })
    expect(execSync).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('dryRun. Command skipped: echo hello')
    consoleSpy.mockRestore()
  })

  it('should skip execution and suppress log when dryRun and quiet are both true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    cliExecSync('echo hello', { dryRun: true, quiet: true })
    expect(execSync).not.toHaveBeenCalled()
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
