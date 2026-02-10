import { describe, expect, it } from 'vitest'
import { Command } from 'commander'
import { addDefaultsOptions } from './addDefaultsOptions'

describe(addDefaultsOptions.name, () => {
  it('should add all default options to a command', () => {
    const cmd = new Command('test')
    addDefaultsOptions(cmd)

    const optionNames = cmd.options.map((o) => o.long)
    expect(optionNames).toContain('--yes')
    expect(optionNames).toContain('--dryRun')
    expect(optionNames).toContain('--quiet')
    expect(optionNames).toContain('--debug')
    expect(optionNames).toContain('--silent')
  })

  it('should add correct short flags', () => {
    const cmd = new Command('test')
    addDefaultsOptions(cmd)

    const shortFlags = cmd.options.map((o) => o.short)
    expect(shortFlags).toContain('-y')
    expect(shortFlags).toContain('-d')
    expect(shortFlags).toContain('-q')
    expect(shortFlags).toContain('-D')
    expect(shortFlags).toContain('-s')
  })

  it('should make --silent imply --yes, --quiet, and not --debug', () => {
    const cmd = new Command('test')
    addDefaultsOptions(cmd)

    const silentOption = cmd.options.find((o) => o.long === '--silent')
    expect(silentOption).toBeDefined()
    // Parse with --silent to verify implies behavior
    cmd.parse(['--silent'], { from: 'user' })
    const opts = cmd.opts()
    expect(opts.silent).toBe(true)
    expect(opts.yes).toBe(true)
    expect(opts.quiet).toBe(true)
    expect(opts.debug).toBe(false)
  })
})
