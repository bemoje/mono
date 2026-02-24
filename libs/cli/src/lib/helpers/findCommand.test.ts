import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { findCommand } from './findCommand'
import type { ICommand } from '../types'

function mockSubcommand(name: string, aliases: string[] = []): ICommand {
  return { name, aliases } as unknown as ICommand
}

function mockCmd(commands: { [name: string]: ICommand } = {}): ICommand {
  return { commands } as unknown as ICommand
}

describe(findCommand.name, () => {
  it('should find subcommand by name', () => {
    const sub = mockSubcommand('build')
    expect(findCommand(mockCmd({ build: sub }), 'build')).toBe(sub)
  })

  it('should find subcommand by alias', () => {
    const sub = mockSubcommand('build', ['b'])
    expect(findCommand(mockCmd({ build: sub }), 'b')).toBe(sub)
  })

  it('should return undefined if subcommand is not found', () => {
    expect(findCommand(mockCmd({ build: mockSubcommand('build') }), 'test')).toBeUndefined()
  })

  it('should return undefined if command has no subcommands', () => {
    expect(findCommand(mockCmd(), 'build')).toBeUndefined()
  })

  it('should find among multiple subcommands', () => {
    const build = mockSubcommand('build', ['b'])
    const test = mockSubcommand('test', ['t'])
    const cmd = mockCmd({ build, test })
    expect(findCommand(cmd, 'test')).toBe(test)
    expect(findCommand(cmd, 't')).toBe(test)
    expect(findCommand(cmd, 'b')).toBe(build)
  })
})
