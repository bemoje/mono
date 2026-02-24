import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Command } from './Command'
import { findCommand } from './helpers/findCommand'

describe(Command.name, () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe(Command.prototype.command.name, () => {
    it('should create subcommand with proper parent-child relationship', () => {
      const parent = new Command('parent')
      parent.setVersion('1.0.0')
      const child = parent.command('child')

      expect(child.name).toBe('child')
      expect(child.version).toBeUndefined() // Does not inherit parent version
      expect(child.parent).toBe(parent)
      expect(Object.values(parent.commands)).toContain(child)
    })

    it('should use empty description when not provided', () => {
      const parent = new Command('parent')
      const child = parent.command('child')

      expect(child.description).toBe('')
    })
  })

  describe(Command.prototype.addCommand.name, () => {
    it('should add subcommand via callback and return parent', () => {
      const parent = new Command('parent')
      const result = parent.addCommand('child', (cmd) => {
        cmd.setDescription('child command')
        return cmd
      })
      expect(result).toBe(parent)
      expect(Object.keys(parent.commands)).toContain('child')
    })

    it('should allow subcommand configuration via callback', () => {
      const parent = new Command('parent')
      parent.addCommand('sub', (cmd) => {
        cmd.addArgument('<file>')
        return cmd
      })
      const sub = (parent.commands as Record<string, Command>)['sub']
      expect(sub.arguments).toHaveLength(1)
    })
  })

  describe('command hierarchy edge cases', () => {
    it('should handle commands with aliases in subcommand parsing', () => {
      const parent = new Command('parent')
      const child = parent.command('child')
      child.setAliases(['c', 'ch'])
      child.addArgument('<input>')

      const result1 = parent.parseArgv(['c', 'input.txt'])
      expect(result1.cmd).toBe(child)
      expect(result1.args).toEqual(['input.txt'])

      const result2 = parent.parseArgv(['ch', 'input.txt'])
      expect(result2.cmd).toBe(child)
      expect(result2.args).toEqual(['input.txt'])
    })

    it('should handle empty command name in findCommand', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(findCommand(parent, '')).toBeUndefined()
    })

    it('should handle null command name in findCommand', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(findCommand(parent, null as any)).toBeUndefined()
    })
  })

  describe('command alias generation fallback', () => {
    it('should fall back to two-char initials when single-char alias is taken', () => {
      const parent = new Command('parent')
      // first command takes 'b' as alias
      parent.command('build')
      // second command 'bundle' would want 'b' but it is taken, should try 'bu'
      parent.command('bundle')
      const bundleCmd = (parent.commands as Record<string, Command>)['bundle']
      expect(bundleCmd.aliases).toContain('bu')
    })

    it('should not add alias when both single and two-char initials are taken', () => {
      const parent = new Command('parent')
      // Take 'b' via build
      parent.command('build')
      // Take 'bu' via an alias on build
      const buildCmd = (parent.commands as Record<string, Command>)['build']
      buildCmd.addAliases('bu')
      // Now 'bundle' can't use 'b' or 'bu'
      parent.command('bundle')
      const bundleCmd = (parent.commands as Record<string, Command>)['bundle']
      expect(bundleCmd.aliases).not.toContain('b')
      expect(bundleCmd.aliases).not.toContain('bu')
    })
  })

  describe('addAliases conflict', () => {
    it('should throw when alias conflicts with sibling command', () => {
      const parent = new Command('parent')
      parent.command('build')
      const other = parent.command('other')
      expect(() => {
        other.addAliases('build')
      }).toThrow(/already used by a sibling/)
    })
  })

  describe('command name duplication', () => {
    it('should throw when adding command with duplicate name', () => {
      const parent = new Command('parent')
      parent.command('child')
      expect(() => {
        parent.command('child')
      }).toThrow(/already used/)
    })
  })

  describe('command with callback', () => {
    it('should invoke callback and return its result', () => {
      const parent = new Command('parent')
      const child = parent.command('sub', (cmd) => {
        cmd.setDescription('from callback')
        return cmd
      })
      expect(child.description).toBe('from callback')
    })
  })

  describe('subcommand after arguments', () => {
    it('should throw when adding subcommand to command with arguments', () => {
      const cmd = new Command('test').addArgument('<input>')
      expect(() => {
        ;(cmd as unknown as Command).command('sub')
      }).toThrow(/already has arguments defined/)
    })
  })
})
