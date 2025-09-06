import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { renderHelp } from './renderHelp'
import { Help, type ICommandHelp, type IOptionHelp, type IArgumentHelp } from './Help'

describe(renderHelp.name, () => {
  it('examples', () => {
    expect(() => {
      // Mock command for testing
      const mockCommand: ICommandHelp = {
        name: 'myapp',
        aliases: ['app'],
        summary: 'My application',
        description: 'A comprehensive test application',
        hidden: false,
        usage: '[options] <input> [output]',
        group: undefined,
        commands: [],
        options: [
          {
            flags: '-v, --verbose',
            description: 'Enable verbose output',
            short: 'v',
            long: 'verbose',
            required: false,
            hidden: false,
          } as IOptionHelp,
        ],
        arguments: [
          {
            name: 'input',
            description: 'Input file path',
            required: true,
            variadic: false,
          } as IArgumentHelp,
        ],
        parent: null,
        helpConfiguration: {
          showGlobalOptions: true,
          sortOptions: true,
        },
      }

      // Test with default help
      const helpText1 = renderHelp(mockCommand)
      assert.deepStrictEqual(typeof helpText1, 'string')
      assert.ok(helpText1.includes('Usage:'))
      assert.ok(helpText1.includes('myapp'))
      assert.ok(helpText1.includes('verbose'))

      // Test with custom help
      const customHelp = new Help()
      customHelp.sortOptions = false
      const helpText2 = renderHelp(mockCommand, customHelp)
      assert.deepStrictEqual(typeof helpText2, 'string')
      assert.ok(helpText2.includes('Usage:'))
      assert.ok(helpText2.includes('myapp'))
    }).not.toThrow()
  })

  describe('renderHelp function', () => {
    it('should render help using default Help instance when none provided', () => {
      const mockCommand: ICommandHelp = {
        name: 'testcmd',
        aliases: [],
        description: 'Test command description',
        usage: '[options]',
        commands: [],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('testcmd')
      expect(result).toContain('Test command description')
    })

    it('should render help using provided Help instance', () => {
      const mockCommand: ICommandHelp = {
        name: 'testcmd',
        aliases: [],
        description: 'Test command description',
        usage: '[options]',
        commands: [],
        options: [],
        arguments: [],
        parent: null,
      }

      const customHelp = new Help()
      customHelp.helpWidth = 60

      const result = renderHelp(mockCommand, customHelp)

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('testcmd')
      expect(result).toContain('Test command description')
    })

    it('should merge command helpConfiguration with help instance', () => {
      const mockCommand: ICommandHelp = {
        name: 'testcmd',
        aliases: [],
        description: 'Test command description',
        usage: '[options]',
        commands: [],
        options: [
          {
            flags: '-z, --zebra',
            description: 'Z option',
            short: 'z',
            long: 'zebra',
            hidden: false,
          } as IOptionHelp,
          {
            flags: '-a, --alpha',
            description: 'A option',
            short: 'a',
            long: 'alpha',
            hidden: false,
          } as IOptionHelp,
        ],
        arguments: [],
        parent: null,
        helpConfiguration: {
          sortOptions: true,
        },
      }

      const customHelp = new Help()
      customHelp.sortOptions = false // This should be overridden by command config

      const result = renderHelp(mockCommand, customHelp)

      expect(typeof result).toBe('string')
      // Since sortOptions is true in command config, options should be sorted alphabetically
      const alphaIndex = result.indexOf('-a, --alpha')
      const zebraIndex = result.indexOf('-z, --zebra')
      expect(alphaIndex).toBeLessThan(zebraIndex)
    })

    it('should handle command with subcommands', () => {
      const subCommand: ICommandHelp = {
        name: 'subcmd',
        aliases: ['sub'],
        description: 'Subcommand description',
        usage: '',
        commands: [],
        options: [],
        arguments: [],
        parent: null,
        hidden: false,
      }

      const mockCommand: ICommandHelp = {
        name: 'parent',
        aliases: [],
        description: 'Parent command',
        usage: '[command]',
        commands: [subCommand],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(result).toContain('Commands:')
      expect(result).toContain('subcmd')
      expect(result).toContain('Subcommand description')
    })

    it('should handle command with options', () => {
      const mockCommand: ICommandHelp = {
        name: 'testcmd',
        aliases: [],
        description: 'Test command',
        usage: '[options]',
        commands: [],
        options: [
          {
            flags: '-v, --verbose',
            description: 'Enable verbose output',
            short: 'v',
            long: 'verbose',
            hidden: false,
          } as IOptionHelp,
          {
            flags: '-f, --format <type>',
            description: 'Output format',
            short: 'f',
            long: 'format',
            required: true,
            hidden: false,
          } as IOptionHelp,
        ],
        arguments: [],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(result).toContain('Options:')
      expect(result).toContain('-v, --verbose')
      expect(result).toContain('-f, --format')
      expect(result).toContain('Enable verbose output')
      expect(result).toContain('Output format')
    })

    it('should handle command with arguments', () => {
      const mockCommand: ICommandHelp = {
        name: 'testcmd',
        aliases: [],
        description: 'Test command',
        usage: '<input> [output]',
        commands: [],
        options: [],
        arguments: [
          {
            name: 'input',
            description: 'Input file path',
            required: true,
            variadic: false,
          } as IArgumentHelp,
          {
            name: 'output',
            description: 'Output file path',
            required: false,
            variadic: false,
            defaultValue: 'out.txt',
          } as IArgumentHelp,
        ],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(result).toContain('Arguments:')
      expect(result).toContain('input')
      expect(result).toContain('output')
      expect(result).toContain('Input file path')
      expect(result).toContain('Output file path')
    })

    it('should handle command with global options from parent', () => {
      const parentCommand: ICommandHelp = {
        name: 'parent',
        aliases: [],
        description: 'Parent command',
        usage: '',
        commands: [],
        options: [
          {
            flags: '-g, --global',
            description: 'Global option',
            short: 'g',
            long: 'global',
            hidden: false,
          } as IOptionHelp,
        ],
        arguments: [],
        parent: null,
      }

      const mockCommand: ICommandHelp = {
        name: 'child',
        aliases: [],
        description: 'Child command',
        usage: '',
        commands: [],
        options: [],
        arguments: [],
        parent: parentCommand,
        helpConfiguration: {
          showGlobalOptions: true,
        },
      }

      const result = renderHelp(mockCommand)

      expect(result).toContain('Global Options:')
      expect(result).toContain('-g, --global')
      expect(result).toContain('Global option')
    })

    it('should handle empty command', () => {
      const mockCommand: ICommandHelp = {
        name: 'empty',
        aliases: [],
        description: '',
        usage: '',
        commands: [],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('empty')
      // Should not contain sections for empty collections
      expect(result).not.toContain('Commands:')
      expect(result).not.toContain('Options:')
      expect(result).not.toContain('Arguments:')
    })

    it('should handle command with aliases in usage', () => {
      const mockCommand: ICommandHelp = {
        name: 'command',
        aliases: ['cmd', 'c'],
        description: 'Command with aliases',
        usage: '[options]',
        commands: [],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = renderHelp(mockCommand)

      expect(result).toContain('Usage:')
      expect(result).toContain('command|cmd')
    })
  })
})
