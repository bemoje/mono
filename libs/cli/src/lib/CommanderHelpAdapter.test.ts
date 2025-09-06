import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Command } from 'commander'
import { CommanderHelpAdapter } from './CommanderHelpAdapter'
import { Help } from './Help'

describe(CommanderHelpAdapter.name, () => {
  it('examples', () => {
    expect(() => {
      // Create a real commander command
      const cmd = new Command('myapp')
        .aliases(['app'])
        .description('A test application using commander.js')
        .usage('[options] <file>')
        .option('-v, --verbose', 'Enable verbose output')
        .option('-f, --format <type>', 'Output format')
        .argument('<input>', 'Input file')

      // Create adapter
      const adapter = new CommanderHelpAdapter(cmd)

      // Test basic properties
      assert.deepStrictEqual(adapter.name, 'myapp')
      assert.deepStrictEqual(adapter.aliases, ['app'])
      assert.deepStrictEqual(adapter.description, 'A test application using commander.js')

      // Test help rendering
      const helpText = adapter.renderHelp()
      assert.deepStrictEqual(typeof helpText, 'string')
      assert.ok(helpText.includes('Usage:'))
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create adapter for commander Command instance', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.cmd).toBe(cmd)
    })
  })

  describe('name property', () => {
    it('should return command name from commander instance', () => {
      const cmd = new Command('testcommand')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.name).toBe('testcommand')
    })
  })

  describe('aliases property', () => {
    it('should return command aliases from commander instance', () => {
      const cmd = new Command('test').aliases(['t', 'tst'])
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.aliases).toEqual(['t', 'tst'])
    })

    it('should return empty array when no aliases', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.aliases).toEqual([])
    })
  })

  describe('summary property', () => {
    it('should extract first line of description as summary when multi-line', () => {
      const cmd = new Command('test').description('First line\nSecond line\nThird line')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.summary).toBe('First line')
    })

    it('should return undefined when description is single line', () => {
      const cmd = new Command('test').description('Single line description')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.summary).toBeUndefined()
    })

    it('should return undefined when no description', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.summary).toBeUndefined()
    })

    it('should cache summary result', () => {
      const cmd = new Command('test').description('First line\nSecond line')
      const adapter = new CommanderHelpAdapter(cmd)

      const summary1 = adapter.summary
      const summary2 = adapter.summary
      expect(summary1).toBe(summary2)
    })
  })

  describe('description property', () => {
    it('should return command description from commander instance', () => {
      const cmd = new Command('test').description('Test command description')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.description).toBe('Test command description')
    })
  })

  describe('hidden property', () => {
    it('should return false as commander commands are not hidden by default', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.hidden).toBe(false)
    })
  })

  describe('usage property', () => {
    it('should return usage from commander instance', () => {
      const cmd = new Command('test').usage('[options] <input> [output]')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.usage).toBe('[options] <input> [output]')
    })

    it('should return default usage [options] when no usage set', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.usage).toBe('[options]')
    })

    it('should cache usage result', () => {
      const cmd = new Command('test').usage('[options] <file>')
      const adapter = new CommanderHelpAdapter(cmd)

      const usage1 = adapter.usage
      const usage2 = adapter.usage
      expect(usage1).toBe(usage2)
    })
  })

  describe('group property', () => {
    it('should return undefined as commander helpGroup returns empty string', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.group).toBe('')
    })
  })

  describe('commands property', () => {
    it('should return adapted subcommands', () => {
      const cmd = new Command('test')
      cmd.command('sub1').description('Subcommand 1')
      cmd.command('sub2').description('Subcommand 2')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.commands).toHaveLength(2)
      expect(adapter.commands[0].name).toBe('sub1')
      expect(adapter.commands[1].name).toBe('sub2')
    })

    it('should return empty array when no subcommands', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.commands).toEqual([])
    })

    it('should cache commands result', () => {
      const cmd = new Command('test')
      cmd.command('sub').description('Subcommand')
      const adapter = new CommanderHelpAdapter(cmd)

      const commands1 = adapter.commands
      const commands2 = adapter.commands
      expect(commands1).toBe(commands2)
    })
  })

  describe('options property', () => {
    it('should return adapted options', () => {
      const cmd = new Command('test')
        .option('-v, --verbose', 'Enable verbose output')
        .option('-f, --format <type>', 'Output format')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.options).toHaveLength(2)
      expect(adapter.options[0].flags).toBe('-v, --verbose')
      expect(adapter.options[1].flags).toBe('-f, --format <type>')
    })

    it('should return empty array when no options', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.options).toEqual([])
    })

    it('should cache options result', () => {
      const cmd = new Command('test').option('-v, --verbose', 'Verbose output')
      const adapter = new CommanderHelpAdapter(cmd)

      const options1 = adapter.options
      const options2 = adapter.options
      expect(options1).toBe(options2)
    })
  })

  describe('arguments property', () => {
    it('should return adapted arguments', () => {
      const cmd = new Command('test').argument('<input>', 'Input file')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.arguments).toHaveLength(1)
      expect(adapter.arguments[0].name).toBe('input')
    })

    it('should return empty array when no arguments', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.arguments).toEqual([])
    })

    it('should cache arguments result', () => {
      const cmd = new Command('test').argument('<file>', 'Input file')
      const adapter = new CommanderHelpAdapter(cmd)

      const args1 = adapter.arguments
      const args2 = adapter.arguments
      expect(args1).toBe(args2)
    })
  })

  describe('parent property', () => {
    it('should return adapted parent command', () => {
      const parent = new Command('parent')
      const child = parent.command('child')
      const adapter = new CommanderHelpAdapter(child)

      expect(adapter.parent).not.toBeNull()
      expect(adapter.parent?.name).toBe('parent')
    })

    it('should return null when no parent', () => {
      const cmd = new Command('root')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(adapter.parent).toBeNull()
    })

    it('should cache parent result', () => {
      const parent = new Command('parent')
      const child = parent.command('child')
      const adapter = new CommanderHelpAdapter(child)

      const parent1 = adapter.parent
      const parent2 = adapter.parent
      expect(parent1).toBe(parent2)
    })
  })

  describe('helpConfiguration property', () => {
    it('should return configuration from commander help', () => {
      const cmd = new Command('test')
      const adapter = new CommanderHelpAdapter(cmd)

      expect(typeof adapter.helpConfiguration).toBe('object')
    })
  })

  describe('renderHelp method', () => {
    it('should render help using provided Help instance', () => {
      const cmd = new Command('test').description('Test command')
      const adapter = new CommanderHelpAdapter(cmd)
      const customHelp = new Help()

      const result = adapter.renderHelp(customHelp)

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('test')
    })

    it('should render help using default Help instance when none provided', () => {
      const cmd = new Command('test').description('Test command')
      const adapter = new CommanderHelpAdapter(cmd)

      const result = adapter.renderHelp()

      expect(typeof result).toBe('string')
      expect(result).toContain('Usage:')
      expect(result).toContain('test')
    })
  })
})
