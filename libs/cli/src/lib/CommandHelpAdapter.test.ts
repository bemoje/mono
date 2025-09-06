import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Command } from './Command'
import { CommandHelpAdapter } from './CommandHelpAdapter'
import { Help } from './Help'

describe(CommandHelpAdapter.name, () => {
  it('examples', () => {
    expect(() => {
      // Create a command with various configurations
      const cmd = new Command('myapp')
        .setVersion('1.0.0')
        .setDescription('A test application for CLI operations')
        .setSummary('Test CLI app')
        .setAliases('app', 'test')
        .argument('<input>', 'Input file path')
        .argument('[output]', 'Output file path', { defaultValue: 'out.txt' })
        .option('-v, --verbose', 'Enable verbose output')
        .option('-f, --format <type>', 'Output format')
        .setGroup('Tools')

      // Create adapter
      const adapter = new CommandHelpAdapter(cmd)

      // Test basic properties
      assert.deepStrictEqual(adapter.name, 'myapp')
      assert.deepStrictEqual(adapter.aliases, ['app', 'test'])
      assert.deepStrictEqual(adapter.summary, 'Test CLI app')
      assert.deepStrictEqual(adapter.description, 'A test application for CLI operations')
      assert.deepStrictEqual(adapter.group, 'Tools')
      assert.deepStrictEqual(adapter.hidden, undefined)

      // Test usage generation
      const usage = adapter.usage
      assert.ok(usage.includes('[options]'))
      assert.ok(usage.includes('<input>'))
      assert.ok(usage.includes('[output]'))

      // Test help rendering
      const helpText = adapter.renderHelp()
      assert.deepStrictEqual(typeof helpText, 'string')
      assert.ok(helpText.includes('Usage:'))
      assert.ok(helpText.includes('myapp'))
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create adapter for Command instance', () => {
      const cmd = new Command('test')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.cmd).toBe(cmd)
    })
  })

  describe('name property', () => {
    it('should return command name', () => {
      const cmd = new Command('mycommand')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.name).toBe('mycommand')
    })
  })

  describe('aliases property', () => {
    it('should return command aliases', () => {
      const cmd = new Command('test').setAliases('t', 'tst')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.aliases).toEqual(['t', 'tst'])
    })

    it('should return empty array when no aliases', () => {
      const cmd = new Command('test')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.aliases).toEqual([])
    })
  })

  describe('summary property', () => {
    it('should return explicit summary when set', () => {
      const cmd = new Command('test').setSummary('Test summary')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.summary).toBe('Test summary')
    })

    it('should extract first line of description when summary not set', () => {
      const cmd = new Command('test').setDescription('First line', 'Second line')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.summary).toBe('First line')
    })

    it('should return undefined when neither summary nor multiline description', () => {
      const cmd = new Command('test').setDescription('Single line description')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.summary).toBeUndefined()
    })
  })

  describe('description property', () => {
    it('should return command description', () => {
      const cmd = new Command('test').setDescription('Test description')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.description).toBe('Test description')
    })
  })

  describe('hidden property', () => {
    it('should return command hidden status', () => {
      const cmd = new Command('test').setHidden(true)
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.hidden).toBe(true)
    })

    it('should return undefined when not hidden', () => {
      const cmd = new Command('test')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.hidden).toBeUndefined()
    })
  })

  describe('usage property', () => {
    it('should generate usage with options when command has options', () => {
      const cmd = new Command('test').option('-v, --verbose', 'Verbose output')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.usage).toContain('[options]')
    })

    it('should generate usage with command when command has subcommands', () => {
      const cmd = new Command('test')
      cmd.subcommand('sub')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.usage).toContain('[command]')
    })

    it('should generate usage with arguments', () => {
      const cmd = new Command('test')
        .argument('<required>', 'Required argument')
        .argument('[optional]', 'Optional argument')
        .argument('<variadic...>', 'Variadic argument')
      const adapter = new CommandHelpAdapter(cmd)

      const usage = adapter.usage
      expect(usage).toContain('<required>')
      expect(usage).toContain('[optional]')
      expect(usage).toContain('<variadic...>')
    })

    it('should generate minimal usage when no options, commands, or arguments', () => {
      const cmd = new Command('test')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.usage).toBe('')
    })

    it('should cache usage result', () => {
      const cmd = new Command('test').option('-v, --verbose', 'Verbose output')
      const adapter = new CommandHelpAdapter(cmd)

      const usage1 = adapter.usage
      const usage2 = adapter.usage
      expect(usage1).toBe(usage2)
    })
  })

  describe('group property', () => {
    it('should return command group', () => {
      const cmd = new Command('test').setGroup('Utilities')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.group).toBe('Utilities')
    })

    it('should return undefined when no group set', () => {
      const cmd = new Command('test')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.group).toBeUndefined()
    })
  })

  describe('renderHelp method', () => {
    it('should render help using provided Help instance', () => {
      const cmd = new Command('test').setDescription('Test command')
      const adapter = new CommandHelpAdapter(cmd)
      const customHelp = new Help()

      const result = adapter.renderHelp(customHelp)

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('test')
    })

    it('should render help using default Help instance when none provided', () => {
      const cmd = new Command('test').setDescription('Test command')
      const adapter = new CommandHelpAdapter(cmd)

      const result = adapter.renderHelp()

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('test')
    })
  })

  describe('argument and option adapters', () => {
    it('should provide adapted arguments', () => {
      const cmd = new Command('test')
        .argument('<input>', 'Input file')
        .argument('[output]', 'Output file', { defaultValue: 'out.txt' })
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.arguments).toHaveLength(2)
      expect(adapter.arguments[0].name).toBe('input')
      expect(adapter.arguments[1].name).toBe('output')
    })

    it('should provide adapted options', () => {
      const cmd = new Command('test')
        .option('-v, --verbose', 'Verbose output')
        .option('-f, --format <type>', 'Output format')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.options).toHaveLength(2)
      expect(adapter.options[0].short).toBe('v')
      expect(adapter.options[1].short).toBe('f')
    })

    it('should provide adapted subcommands', () => {
      const cmd = new Command('test')
      cmd.subcommand('sub1').setDescription('Subcommand 1')
      cmd.subcommand('sub2').setDescription('Subcommand 2')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.commands).toHaveLength(2)
      expect(adapter.commands[0].name).toBe('sub1')
      expect(adapter.commands[1].name).toBe('sub2')
    })
  })

  describe('parent relationship', () => {
    it('should handle parent command correctly', () => {
      const parent = new Command('parent')
      const child = new Command('child', parent)
      const adapter = new CommandHelpAdapter(child)

      expect(adapter.parent).not.toBeNull()
      expect(adapter.parent?.name).toBe('parent')
    })

    it('should handle null parent', () => {
      const cmd = new Command('root')
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.parent).toBeNull()
    })
  })

  describe('helpConfiguration property', () => {
    it('should return command help configuration', () => {
      const cmd = new Command('test').setHelpConfiguration({
        showGlobalOptions: false,
        sortOptions: false,
      })
      const adapter = new CommandHelpAdapter(cmd)

      expect(adapter.helpConfiguration).toEqual({
        showGlobalOptions: false,
        sortOptions: false,
      })
    })
  })
})
