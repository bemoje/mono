/* eslint-disable max-lines */
import type { Argument } from './types'
import { Help } from './Help'
import type { ICommand } from './types'
import type { IHelp } from './types'
import type { Option } from './types'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

function mockOption(overrides: Partial<Option> = {}): Option {
  return {
    type: 'boolean',
    flags: '-v, --verbose',
    short: 'v',
    long: 'verbose',
    name: 'verbose',
    description: 'Enable verbose mode',
    ...overrides,
  }
}

function mockArgument(overrides: Partial<Argument> = {}): Argument {
  return { usage: '<file>', name: 'file', description: 'File to process', required: true, ...overrides }
}

function mockCmd(overrides: Partial<ICommand> = {}): ICommand {
  const cmd = {
    name: 'test',
    aliases: [],
    description: 'A test command',
    arguments: [],
    options: [],
    commands: {},
    help: undefined as unknown as IHelp,
    ...overrides,
  } as ICommand
  Object.defineProperty(cmd, 'help', { value: new Help(cmd), writable: true })
  return cmd
}

describe(Help.name, () => {
  describe('constructor', () => {
    it('should make cmd non-enumerable', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(Object.keys(help)).not.toContain('cmd')
    })

    it('should use process.stdout.columns when isTTY', () => {
      const origIsTTY = process.stdout.isTTY
      const origColumns = process.stdout.columns
      try {
        Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true })
        Object.defineProperty(process.stdout, 'columns', { value: 120, configurable: true })
        const help = new Help(mockCmd())
        expect(help.helpWidth).toBe(120)
      } finally {
        Object.defineProperty(process.stdout, 'isTTY', { value: origIsTTY, configurable: true })
        Object.defineProperty(process.stdout, 'columns', { value: origColumns, configurable: true })
      }
    })

    it('should use 80 when not a TTY', () => {
      const origIsTTY = process.stdout.isTTY
      try {
        Object.defineProperty(process.stdout, 'isTTY', { value: undefined, configurable: true })
        const help = new Help(mockCmd())
        expect(help.helpWidth).toBe(80)
      } finally {
        Object.defineProperty(process.stdout, 'isTTY', { value: origIsTTY, configurable: true })
      }
    })
  })

  describe(Help.prototype.visibleCommands.name, () => {
    it('should filter hidden commands', () => {
      const cmd = mockCmd({
        commands: { visible: mockCmd({ name: 'visible' }), hidden: mockCmd({ name: 'hidden', hidden: true }) },
      })
      const help = new Help(cmd)
      const result = help.visibleCommands()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('visible')
    })

    it('should sort subcommands by name', () => {
      const cmd = mockCmd({ commands: { beta: mockCmd({ name: 'beta' }), alpha: mockCmd({ name: 'alpha' }) } })
      const help = new Help(cmd)
      const result = help.visibleCommands()
      expect(result[0].name).toBe('alpha')
      expect(result[1].name).toBe('beta')
    })

    it('should not sort when sortSubcommands is false', () => {
      const cmd = mockCmd({ commands: { beta: mockCmd({ name: 'beta' }), alpha: mockCmd({ name: 'alpha' }) } })
      const help = new Help(cmd)
      help.sortSubcommands = false
      const result = help.visibleCommands()
      expect(result[0].name).toBe('beta')
    })
  })

  describe(Help.prototype.compareOptions.name, () => {
    it('should compare by short name', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const a = mockOption({ short: 'a', long: 'alpha' })
      const b = mockOption({ short: 'b', long: 'beta' })
      expect(help.compareOptions(a, b)).toBeLessThan(0)
    })

    it('should compare by long name when short is missing', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const a = mockOption({ short: '', long: 'alpha' })
      const b = mockOption({ short: '', long: 'beta' })
      expect(help.compareOptions(a, b)).toBeLessThan(0)
    })
  })

  describe(Help.prototype.visibleOptions.name, () => {
    it('should filter hidden options and sort', () => {
      const cmd = mockCmd({
        options: [
          mockOption({ short: 'b', long: 'beta', name: 'beta' }),
          mockOption({ short: 'a', long: 'alpha', name: 'alpha' }),
          mockOption({ short: 'h', long: 'hidden', name: 'hidden', hidden: true }),
        ],
      })
      const help = new Help(cmd)
      const result = help.visibleOptions()
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('alpha')
    })
  })

  describe(Help.prototype.visibleArguments.name, () => {
    it('should return all arguments', () => {
      const cmd = mockCmd({
        arguments: [
          mockArgument({ name: 'a', description: 'First' }),
          mockArgument({ name: 'b', description: '' }),
        ],
      })
      const help = new Help(cmd)
      expect(help.visibleArguments()).toHaveLength(2)
    })
  })

  describe(Help.prototype.subcommandTerm.name, () => {
    it('should format subcommand with alias, options, and args', () => {
      const sub = mockCmd({
        name: 'serve',
        aliases: ['s'],
        options: [mockOption()],
        arguments: [mockArgument({ usage: '<port>' })],
      })
      const cmd = mockCmd({ commands: { serve: sub } })
      const help = new Help(cmd)
      const result = help.subcommandTerm(sub)
      expect(result).toContain('s')
      expect(result).toContain('serve')
      expect(result).toContain('[opts]')
      expect(result).toContain('<port>')
    })

    it('should format subcommand without alias, options, or args', () => {
      const sub = mockCmd({ name: 'serve' })
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.subcommandTerm(sub)
      expect(result).toBe('serve')
    })
  })

  describe(Help.prototype.optionTerm.name, () => {
    it('should return flags', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.optionTerm(mockOption({ flags: '-v, --verbose' }))).toBe('-v, --verbose')
    })
  })

  describe(Help.prototype.argumentTerm.name, () => {
    it('should return argument name', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.argumentTerm(mockArgument({ name: 'file' }))).toBe('<file>')
    })
  })

  describe(Help.prototype.commandUsage.name, () => {
    it('should include parent path', () => {
      const parent = mockCmd({ name: 'parent' })
      const cmd = mockCmd({ name: 'child', parent })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('parent child')
    })

    it('should include alias', () => {
      const cmd = mockCmd({ name: 'serve', aliases: ['s'] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('serve')
    })

    it('should include [cmd] when commands exist', () => {
      const cmd = mockCmd({ commands: { sub: mockCmd({ name: 'sub' }) } })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('[cmd]')
    })

    it('should not include [cmd] when no commands exist', () => {
      const cmd = mockCmd({ commands: {} })
      const help = new Help(cmd)
      expect(help.commandUsage()).not.toContain('[cmd]')
    })

    it('should include [opts] when options exist', () => {
      const cmd = mockCmd({ options: [mockOption()] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('[opts]')
    })

    it('should format required arg', () => {
      const cmd = mockCmd({ arguments: [mockArgument({ name: 'file', required: true, variadic: false })] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('<file>')
    })

    it('should format required variadic arg', () => {
      const cmd = mockCmd({ arguments: [mockArgument({ name: 'files', required: true, variadic: true })] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('<files...>')
    })

    it('should format optional arg', () => {
      const cmd = mockCmd({ arguments: [mockArgument({ name: 'file', required: false, variadic: false })] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('[file]')
    })

    it('should format optional variadic arg', () => {
      const cmd = mockCmd({ arguments: [mockArgument({ name: 'files', required: false, variadic: true })] })
      const help = new Help(cmd)
      expect(help.commandUsage()).toContain('[files...]')
    })
  })

  describe(Help.prototype.commandDescription.name, () => {
    it('should return description', () => {
      const cmd = mockCmd({ description: 'My command' })
      const help = new Help(cmd)
      expect(help.commandDescription()).toBe('My command')
    })

    it('should include aliases when present', () => {
      const cmd = mockCmd({ description: 'My command', aliases: ['mc', 'm'] })
      const help = new Help(cmd)
      const result = help.commandDescription()
      expect(result).toContain('Aliases: mc, m')
      expect(result).toContain('My command')
    })
  })

  describe(Help.prototype.subcommandDescription.name, () => {
    it('should return summary when available', () => {
      const sub = mockCmd({ summary: 'Short summary', description: 'Long description' })
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.subcommandDescription(sub)).toBe('Short summary')
    })

    it('should return first line of description when multiline', () => {
      const sub = mockCmd({ description: 'First line\nSecond line' })
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.subcommandDescription(sub)).toBe('First line')
    })

    it('should return description for single-line description without summary', () => {
      const sub = mockCmd({ summary: undefined, description: 'Single line' })
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.subcommandDescription(sub)).toBe('Single line')
    })
  })

  describe(Help.prototype.optionDescription.name, () => {
    it('should return plain description', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.optionDescription(mockOption({ description: 'Help text' }))).toBe('Help text')
    })

    it('should include choices', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: 'Choose', choices: ['a', 'b'] }))
      expect(result).toContain('choices: a, b')
    })

    it('should include default value', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: 'Output', defaultValue: '/tmp' }))
      expect(result).toContain('default: /tmp')
    })

    it('should use defaultValueDescription when provided', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(
        mockOption({ description: 'Output', defaultValue: '/tmp', defaultValueDescription: 'temp dir' })
      )
      expect(result).toContain('default: temp dir')
    })

    it('should skip empty array as defaultValue', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: 'Tags', defaultValue: [] }))
      expect(result).not.toContain('default:')
    })

    it('should include env', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: 'Verbose', env: 'VERBOSE' }))
      expect(result).toContain('env: VERBOSE')
    })

    it('should return only extra info when no description', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: '', env: 'VERBOSE' }))
      expect(result).toBe('(env: VERBOSE)')
    })

    it('should return empty string when description is undefined and no extra info', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.optionDescription(mockOption({ description: undefined as unknown as string }))
      expect(result).toBe('')
    })
  })

  describe(Help.prototype.argumentDescription.name, () => {
    it('should return plain description', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.argumentDescription(mockArgument({ description: 'File path' }))).toBe('File path')
    })

    it('should include choices', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.argumentDescription(mockArgument({ description: 'Mode', choices: ['dev', 'prod'] }))
      expect(result).toContain('choices: dev, prod')
    })

    it('should include default value', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.argumentDescription(mockArgument({ description: 'Port', defaultValue: '3000' }))
      expect(result).toContain('default: 3000')
    })

    it('should use defaultValueDescription when provided', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.argumentDescription(
        mockArgument({ description: 'Port', defaultValue: '3000', defaultValueDescription: 'default port' })
      )
      expect(result).toContain('default: default port')
    })

    it('should return only extra info when no description', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.argumentDescription(mockArgument({ description: '', defaultValue: '3000' }))
      expect(result).toBe('(default: 3000)')
    })

    it('should return empty string when description is undefined and no extra info', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.argumentDescription(mockArgument({ description: undefined as unknown as string }))
      expect(result).toBe('')
    })
  })

  describe(Help.prototype.formatItemList.name, () => {
    it('should return empty for no items', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.formatItemList('Options:', [])).toEqual([])
    })

    it('should return heading with items', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.formatItemList('Options:', ['  -v  verbose'])
      expect(result).toHaveLength(3)
      expect(result[2]).toBe('')
    })
  })

  describe(Help.prototype.groupItems.name, () => {
    it('should group items by group key', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const items = [mockOption({ name: 'a', group: 'A' }), mockOption({ name: 'b', group: 'B' })]
      const result = help.groupItems(items, items, (o) => {
        return o.group ?? 'default'
      })
      expect(result.size).toBe(2)
      expect(result.get('A')).toHaveLength(1)
    })

    it('should handle visible item with group not in unsorted', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const unsorted = [mockOption({ name: 'a', group: 'A' })]
      const visible = [mockOption({ name: 'a', group: 'A' }), mockOption({ name: 'c', group: 'C' })]
      const result = help.groupItems(unsorted, visible, (o) => {
        return o.group ?? 'default'
      })
      expect(result.has('C')).toBe(true)
      expect(result.get('C')).toHaveLength(1)
    })
  })

  describe(Help.prototype.displayWidth.name, () => {
    it('should return length for plain text', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.displayWidth('hello')).toBe(5)
    })

    it('should ignore ANSI escape codes', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.displayWidth('\x1b[31mhello\x1b[0m')).toBe(5)
    })
  })

  describe(Help.prototype.preformatted.name, () => {
    it('should return true for preformatted text', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.preformatted('line1\n  indented')).toBe(true)
    })

    it('should return false for non-preformatted text', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.preformatted('no newline')).toBe(false)
    })
  })

  describe(Help.prototype.formatItem.name, () => {
    it('should return indented term when no description', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.formatItem('--verbose', 10, '')).toBe('  --verbose')
    })

    it('should wrap long descriptions', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      help.helpWidth = 50
      const longDesc =
        'A very long description that should definitely wrap around because it exceeds the available width'
      const result = help.formatItem('--out', 5, longDesc)
      expect(result).toContain('\n')
    })

    it('should not wrap preformatted descriptions', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      help.helpWidth = 80
      const result = help.formatItem('--out', 5, 'Line 1\n  indented line')
      expect(result).toContain('Line 1\n')
      expect(result).toContain('indented line')
    })

    it('should not wrap when remaining width < minWidthToWrap', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      help.helpWidth = 20
      help.minWidthToWrap = 40
      const result = help.formatItem('--verbose', 10, 'Some description text here')
      expect(result).toContain('Some description text here')
    })
  })

  describe(Help.prototype.boxWrap.name, () => {
    it('should return as-is when width < minWidthToWrap', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      expect(help.boxWrap('text', 10)).toBe('text')
    })

    it('should handle empty lines', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.boxWrap('line1\n\nline3', 80)
      expect(result).toBe('line1\n\nline3')
    })

    it('should wrap long lines', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const longText = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
      const result = help.boxWrap(longText, 40)
      expect(result).toContain('\n')
    })
  })

  describe(Help.prototype.styleUsage.name, () => {
    it('should style different usage parts', () => {
      const cmd = mockCmd({
        commands: { sub: mockCmd({ name: 'sub' }) },
        options: [mockOption()],
        arguments: [mockArgument({ name: 'req', required: true }), mockArgument({ name: 'opt', required: false })],
      })
      const help = new Help(cmd)
      const usage = help.commandUsage()
      const styled = help.styleUsage(usage)
      // Should not throw and should return a string
      expect(typeof styled).toBe('string')
      expect(styled.length).toBeGreaterThan(0)
    })
  })

  describe(Help.prototype.styleSubcommandTerm.name, () => {
    it('should style subcommand term with opts and args', () => {
      const cmd = mockCmd()
      const help = new Help(cmd)
      const result = help.styleSubcommandTerm('serve [opts] <port> [host]')
      expect(result).toContain('serve')
      expect(result).toContain('[opts]')
    })
  })

  describe('longest* methods', () => {
    it('longestSubcommandAliasLength should return 0 for no commands', () => {
      const help = new Help(mockCmd())
      expect(help.longestSubcommandAliasLength()).toBe(0)
    })

    it('longestSubcommandAliasLength should return alias length', () => {
      const cmd = mockCmd({
        commands: {
          serve: mockCmd({ name: 'serve', aliases: ['s'] }),
          build: mockCmd({ name: 'build', aliases: [] }),
        },
      })
      const help = new Help(cmd)
      expect(help.longestSubcommandAliasLength()).toBe(1)
    })

    it('longestSubcommandTermLength should measure terms', () => {
      const cmd = mockCmd({
        commands: { serve: mockCmd({ name: 'serve' }), buildSomething: mockCmd({ name: 'build-something' }) },
      })
      const help = new Help(cmd)
      expect(help.longestSubcommandTermLength()).toBeGreaterThan(0)
    })

    it('longestOptionTermLength should measure option flags', () => {
      const cmd = mockCmd({ options: [mockOption({ flags: '-v, --verbose' })] })
      const help = new Help(cmd)
      expect(help.longestOptionTermLength()).toBeGreaterThan(0)
    })

    it('longestArgumentTermLength should measure argument names', () => {
      const cmd = mockCmd({ arguments: [mockArgument({ name: 'filename', description: 'The file' })] })
      const help = new Help(cmd)
      expect(help.longestArgumentTermLength()).toBeGreaterThan(0)
    })
  })

  describe(Help.prototype.padWidth.name, () => {
    it('should return max of all longest term lengths', () => {
      const cmd = mockCmd({
        options: [mockOption({ flags: '-v, --verbose' })],
        arguments: [mockArgument({ name: 'file', description: 'The file' })],
        commands: { sub: mockCmd({ name: 'sub' }) },
      })
      const help = new Help(cmd)
      expect(help.padWidth()).toBeGreaterThan(0)
    })
  })

  describe('style pass-through methods', () => {
    it('should pass through text', () => {
      const help = new Help(mockCmd())
      expect(help.styleDescriptionText('desc')).toContain('desc')
      expect(help.styleOptionText('opt')).toBe('opt')
      expect(help.styleArgumentText('arg')).toBe('arg')
      expect(help.styleSubcommandText('sub')).toBe('sub')
      expect(help.styleCommandText('cmd')).toBe('cmd')
    })

    it('should apply styling', () => {
      const help = new Help(mockCmd())
      expect(typeof help.styleTitle('Title')).toBe('string')
      expect(typeof help.styleCommandDescription('desc')).toBe('string')
      expect(typeof help.styleOptionDescription('desc')).toBe('string')
      expect(typeof help.styleSubcommandDescription('desc')).toBe('string')
      expect(typeof help.styleArgumentDescription('desc')).toBe('string')
      expect(typeof help.styleOptionTerm('-v')).toBe('string')
      expect(typeof help.styleArgumentTerm('file')).toBe('string')
    })
  })

  describe(Help.prototype.render.name, () => {
    it('should render minimal command', () => {
      const help = new Help(mockCmd({ name: 'app', description: '' }))
      const output = help.render()
      expect(output).toContain('Usage:')
      expect(output).toContain('app')
    })

    it('should render command with description', () => {
      const help = new Help(mockCmd({ name: 'app', description: 'My application' }))
      const output = help.render()
      expect(output).toContain('My application')
    })

    it('should render full command with args, opts, and subcommands', () => {
      const cmd = mockCmd({
        name: 'app',
        description: 'Full app',
        arguments: [mockArgument({ name: 'input', description: 'Input file' })],
        options: [mockOption({ flags: '-v, --verbose', description: 'Verbose' })],
        commands: {
          serve: mockCmd({ name: 'serve', description: 'Start server', summary: 'Start' }),
          build: mockCmd({ name: 'build', description: 'Build project', summary: 'Build' }),
        },
      })
      const help = new Help(cmd)
      const output = help.render()
      expect(output).toContain('Arguments:')
      expect(output).toContain('Options:')
      expect(output).toContain('Commands:')
    })

    it('should render with option groups', () => {
      const cmd = mockCmd({
        name: 'app',
        options: [
          mockOption({
            short: 'v',
            long: 'verbose',
            name: 'verbose',
            flags: '-v, --verbose',
            group: 'Debug:',
            description: 'Verbose',
          }),
          mockOption({
            short: 'q',
            long: 'quiet',
            name: 'quiet',
            flags: '-q, --quiet',
            group: 'Debug:',
            description: 'Quiet',
          }),
        ],
      })
      const help = new Help(cmd)
      const output = help.render()
      expect(output).toContain('Debug:')
    })

    it('should render with command groups', () => {
      const cmd = mockCmd({
        name: 'app',
        commands: {
          serve: mockCmd({ name: 'serve', summary: 'Start server', group: 'Dev:' }),
          build: mockCmd({ name: 'build', summary: 'Build project', group: 'Build:' }),
        },
      })
      const help = new Help(cmd)
      const output = help.render()
      expect(output).toContain('Dev:')
      expect(output).toContain('Build:')
    })
  })
})
