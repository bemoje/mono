import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Help, type ICommandHelp, type IOptionHelp, type IArgumentHelp } from './Help'

describe(Help.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic help instance
      const help = new Help()
      assert.deepStrictEqual(typeof help.helpWidth, 'number')
      assert.deepStrictEqual(help.minWidthToWrap, 40)

      // Mock command for testing
      const mockCommand: ICommandHelp = {
        name: 'test',
        aliases: ['t'],
        summary: 'Test command',
        description: 'A test command description',
        hidden: false,
        usage: '[options] <file>',
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
            name: 'file',
            description: 'Input file',
            required: true,
            variadic: false,
          } as IArgumentHelp,
        ],
        parent: null,
        helpConfiguration: {},
      }

      // Test basic methods
      const visibleCommands = help.visibleCommands(mockCommand)
      assert.deepStrictEqual(visibleCommands, [])

      const visibleOptions = help.visibleOptions(mockCommand)
      assert.deepStrictEqual(visibleOptions.length, 1)
      assert.deepStrictEqual(visibleOptions[0].flags, '-v, --verbose')

      const visibleArgs = help.visibleArguments(mockCommand)
      assert.deepStrictEqual(visibleArgs.length, 1)
      assert.deepStrictEqual(visibleArgs[0].name, 'file')

      // Test formatting
      const formattedHelp = help.formatHelp(mockCommand, help)
      assert.deepStrictEqual(typeof formattedHelp, 'string')
      assert.ok(formattedHelp.includes('Usage:'))
      assert.ok(formattedHelp.includes('test'))
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create help instance with default values', () => {
      const help = new Help()

      expect(help.helpWidth).toBeTypeOf('number')
      expect(help.minWidthToWrap).toBe(40)
      expect(help.sortSubcommands).toBeUndefined()
      expect(help.sortOptions).toBeUndefined()
      expect(help.showGlobalOptions).toBeUndefined()
    })

    it('should use terminal width when TTY is available', () => {
      const help = new Help()

      if (process.stdout.isTTY) {
        expect(help.helpWidth).toBe(process.stdout.columns)
      } else {
        expect(help.helpWidth).toBe(80)
      }
    })
  })

  describe(Help.prototype.visibleCommands.name, () => {
    it('should return visible commands', () => {
      const help = new Help()
      const mockCommand: ICommandHelp = {
        name: 'parent',
        aliases: [],
        description: 'Parent command',
        usage: '',
        commands: [
          {
            name: 'visible',
            aliases: [],
            description: 'Visible command',
            usage: '',
            commands: [],
            options: [],
            arguments: [],
            parent: null,
            hidden: false,
          } as ICommandHelp,
          {
            name: 'hidden',
            aliases: [],
            description: 'Hidden command',
            usage: '',
            commands: [],
            options: [],
            arguments: [],
            parent: null,
            hidden: true,
          } as ICommandHelp,
        ],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = help.visibleCommands(mockCommand)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('visible')
    })

    it('should sort commands when sortSubcommands is true', () => {
      const help = new Help()
      help.sortSubcommands = true

      const mockCommand: ICommandHelp = {
        name: 'parent',
        aliases: [],
        description: 'Parent command',
        usage: '',
        commands: [
          {
            name: 'zebra',
            aliases: [],
            description: 'Z command',
            usage: '',
            commands: [],
            options: [],
            arguments: [],
            parent: null,
            hidden: false,
          } as ICommandHelp,
          {
            name: 'alpha',
            aliases: [],
            description: 'A command',
            usage: '',
            commands: [],
            options: [],
            arguments: [],
            parent: null,
            hidden: false,
          } as ICommandHelp,
        ],
        options: [],
        arguments: [],
        parent: null,
      }

      const result = help.visibleCommands(mockCommand)
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('alpha')
      expect(result[1].name).toBe('zebra')
    })
  })

  describe(Help.prototype.visibleOptions.name, () => {
    it('should return visible options', () => {
      const help = new Help()
      const mockCommand: ICommandHelp = {
        name: 'test',
        aliases: [],
        description: 'Test command',
        usage: '',
        commands: [],
        options: [
          {
            flags: '-v, --verbose',
            description: 'Verbose output',
            short: 'v',
            long: 'verbose',
            hidden: false,
          } as IOptionHelp,
          {
            flags: '-h, --hidden',
            description: 'Hidden option',
            short: 'h',
            long: 'hidden',
            hidden: true,
          } as IOptionHelp,
        ],
        arguments: [],
        parent: null,
      }

      const result = help.visibleOptions(mockCommand)
      expect(result).toHaveLength(1)
      expect(result[0].flags).toBe('-v, --verbose')
    })

    it('should sort options when sortOptions is true', () => {
      const help = new Help()
      help.sortOptions = true

      const mockCommand: ICommandHelp = {
        name: 'test',
        aliases: [],
        description: 'Test command',
        usage: '',
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
      }

      const result = help.visibleOptions(mockCommand)
      expect(result).toHaveLength(2)
      expect(result[0].short).toBe('a')
      expect(result[1].short).toBe('z')
    })
  })

  describe(Help.prototype.visibleGlobalOptions.name, () => {
    it('should return empty array when showGlobalOptions is false', () => {
      const help = new Help()
      help.showGlobalOptions = false

      const mockCommand: ICommandHelp = {
        name: 'child',
        aliases: [],
        description: 'Child command',
        usage: '',
        commands: [],
        options: [],
        arguments: [],
        parent: {
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
        } as ICommandHelp,
      }

      const result = help.visibleGlobalOptions(mockCommand)
      expect(result).toHaveLength(0)
    })

    it('should return global options when showGlobalOptions is true', () => {
      const help = new Help()
      help.showGlobalOptions = true

      const parent: ICommandHelp = {
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
        parent,
      }

      const result = help.visibleGlobalOptions(mockCommand)
      expect(result).toHaveLength(1)
      expect(result[0].flags).toBe('-g, --global')
    })
  })

  describe(Help.prototype.visibleArguments.name, () => {
    it('should return empty array when no arguments have descriptions', () => {
      const help = new Help()
      const mockCommand: ICommandHelp = {
        name: 'test',
        aliases: [],
        description: 'Test command',
        usage: '',
        commands: [],
        options: [],
        arguments: [
          {
            name: 'file',
            description: '',
            required: true,
            variadic: false,
          } as IArgumentHelp,
        ],
        parent: null,
      }

      const result = help.visibleArguments(mockCommand)
      expect(result).toHaveLength(0)
    })

    it('should return all arguments when at least one has a description', () => {
      const help = new Help()
      const mockCommand: ICommandHelp = {
        name: 'test',
        aliases: [],
        description: 'Test command',
        usage: '',
        commands: [],
        options: [],
        arguments: [
          {
            name: 'file',
            description: 'Input file',
            required: true,
            variadic: false,
          } as IArgumentHelp,
          {
            name: 'output',
            description: '',
            required: false,
            variadic: false,
          } as IArgumentHelp,
        ],
        parent: null,
      }

      const result = help.visibleArguments(mockCommand)
      expect(result).toHaveLength(2)
    })
  })

  describe(Help.prototype.formatHelp.name, () => {
    it('should generate complete help text', () => {
      const help = new Help()
      const mockCommand: ICommandHelp = {
        name: 'myapp',
        aliases: ['app'],
        summary: 'My application',
        description: 'A comprehensive application for testing',
        usage: '[options] <input> [output]',
        commands: [],
        options: [
          {
            flags: '-v, --verbose',
            description: 'Enable verbose output',
            short: 'v',
            long: 'verbose',
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
      }

      const result = help.formatHelp(mockCommand, help)

      expect(result).toContain('Usage:')
      expect(result).toContain('myapp')
      expect(result).toContain('A comprehensive application for testing')
      expect(result).toContain('Arguments:')
      expect(result).toContain('Options:')
      expect(result).toContain('input')
      expect(result).toContain('-v, --verbose')
    })
  })

  describe('styling methods', () => {
    it('should provide default styling that returns input unchanged', () => {
      const help = new Help()
      const text = 'test text'

      expect(help.styleTitle(text)).toBe(text)
      expect(help.styleCommandDescription(text)).toBe(text)
      expect(help.styleOptionDescription(text)).toBe(text)
      expect(help.styleSubcommandDescription(text)).toBe(text)
      expect(help.styleArgumentDescription(text)).toBe(text)
      expect(help.styleDescriptionText(text)).toBe(text)
      expect(help.styleOptionTerm(text)).toBe(text)
      expect(help.styleArgumentTerm(text)).toBe(text)
      expect(help.styleOptionText(text)).toBe(text)
      expect(help.styleArgumentText(text)).toBe(text)
      expect(help.styleSubcommandText(text)).toBe(text)
      expect(help.styleCommandText(text)).toBe(text)
    })
  })

  describe(Help.prototype.displayWidth.name, () => {
    it('should calculate display width ignoring ANSI codes', () => {
      const help = new Help()

      expect(help.displayWidth('hello')).toBe(5)
      expect(help.displayWidth('\x1b[31mhello\x1b[0m')).toBe(5) // red text
      expect(help.displayWidth('\x1b[1;32mbold green\x1b[0m')).toBe(10) // bold green
    })
  })

  describe(Help.prototype.boxWrap.name, () => {
    it('should wrap text at specified width when width is above minWidthToWrap', () => {
      const help = new Help()

      // Use a width above minWidthToWrap (40) to ensure wrapping happens
      const text =
        'This is an extremely long line of text that contains many many words and should definitely be wrapped at the specified width when the width is set to fifty characters because it is much longer than fifty characters and should definitely wrap'
      const result = help.boxWrap(text, 50)

      const lines = result.split('\n')
      expect(lines.length).toBeGreaterThan(1)
      lines.forEach((line) => {
        expect(help.displayWidth(line.trim())).toBeLessThanOrEqual(50)
      })
    })

    it('should not wrap when width is less than minWidthToWrap', () => {
      const help = new Help()

      const text = 'This is a long line that should not be wrapped'
      const result = help.boxWrap(text, 10) // Less than minWidthToWrap (40)

      expect(result).toBe(text)
    })

    it('should preserve existing line breaks', () => {
      const help = new Help()

      const text = 'Line one\nLine two\nLine three'
      const result = help.boxWrap(text, 100)

      const lines = result.split('\n')
      expect(lines).toHaveLength(3)
      expect(lines[0]).toContain('Line one')
      expect(lines[1]).toContain('Line two')
      expect(lines[2]).toContain('Line three')
    })
  })
})
