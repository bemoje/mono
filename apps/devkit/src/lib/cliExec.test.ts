import { beforeEach } from 'vitest'
import { cliExec } from './cliExec'
import { describe } from 'vitest'
import { execSync } from 'child_process'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

vi.mock('child_process', () => {
  return { execSync: vi.fn() }
})

describe(cliExec.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should execute a command with inherited stdio by default', async () => {
    await cliExec('echo hello')
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'inherit', cwd: process.cwd() })
  })

  it('should use ignore stdio when quiet is true', async () => {
    await cliExec('echo hello', { quiet: true })
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'ignore', cwd: process.cwd() })
  })

  it('should use provided cwd', async () => {
    await cliExec('echo hello', { cwd: '/some/path' })
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'inherit', cwd: '/some/path' })
  })

  it('should skip execution and log when dryRun is true', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await cliExec('echo hello', { dryRun: true })
    expect(execSync).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('dryRun. Command skipped: echo hello')
    consoleSpy.mockRestore()
  })

  it('should skip execution and suppress log when dryRun and quiet are both true', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await cliExec('echo hello', { dryRun: true, quiet: true })
    expect(execSync).not.toHaveBeenCalled()
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
