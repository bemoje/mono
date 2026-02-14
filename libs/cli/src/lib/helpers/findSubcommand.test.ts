import { describe, expect, it } from 'vitest'
import { findSubcommand } from './findSubcommand'
import type { ICommand } from '../types'

function mockSubcommand(name: string, aliases: string[] = []): ICommand {
  return { name, aliases } as unknown as ICommand
}

function mockCmd(commands: ICommand[] = []): ICommand {
  return { commands } as unknown as ICommand
}

describe(findSubcommand.name, () => {
  it('should find subcommand by name', () => {
    const sub = mockSubcommand('build')
    expect(findSubcommand(mockCmd([sub]), 'build')).toBe(sub)
  })

  it('should find subcommand by alias', () => {
    const sub = mockSubcommand('build', ['b'])
    expect(findSubcommand(mockCmd([sub]), 'b')).toBe(sub)
  })

  it('should return undefined if subcommand is not found', () => {
    expect(findSubcommand(mockCmd([mockSubcommand('build')]), 'test')).toBeUndefined()
  })

  it('should return undefined if command has no subcommands', () => {
    expect(findSubcommand(mockCmd(), 'build')).toBeUndefined()
  })

  it('should find among multiple subcommands', () => {
    const build = mockSubcommand('build', ['b'])
    const test = mockSubcommand('test', ['t'])
    const cmd = mockCmd([build, test])
    expect(findSubcommand(cmd, 'test')).toBe(test)
    expect(findSubcommand(cmd, 't')).toBe(test)
    expect(findSubcommand(cmd, 'b')).toBe(build)
  })
})
