import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Command } from './Command'
import { CommandHelpDefinition } from './CommandHelpDefinition'

describe(Command.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic command setup
      const cmd = new Command('myapp', '1.0.0', 'A test application')
        .argument('<input>', 'input file')
        .argument('[output]', 'output file', { defaultValue: 'out.txt' })
        .option('-v, --verbose', 'verbose output')
        .option('-f, --format <type>', 'output format')

      assert.deepStrictEqual(cmd.name, 'myapp')
      assert.deepStrictEqual(cmd.version, '1.0.0')
      assert.deepStrictEqual(cmd.description, 'A test application')

      // Test parsing
      const result = cmd.parse(['input.txt', '-v', '-f', 'json'])
      assert.deepStrictEqual(result.arguments, ['input.txt', 'out.txt'])
      assert.deepStrictEqual(result.options.verbose, true)
      assert.deepStrictEqual(result.options.format, 'json')

      // Variadic arguments
      const cmd2 = new Command('myapp2')
        .argument('<files...>', 'input files')
        .option('-o, --output [dir]', 'output directory', { defaultValue: 'dist' })

      const result2 = cmd2.parse(['file1.txt', 'file2.txt', 'file3.txt'])
      assert.deepStrictEqual(result2.arguments, [['file1.txt', 'file2.txt', 'file3.txt']])
      assert.deepStrictEqual(result2.options.output, 'dist')

      // Variadic options
      const cmd3 = new Command('myapp3')
        .argument('<input>', 'input file')
        .option('-i, --include <patterns...>', 'include patterns')
        .option('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules'] })

      const result3 = cmd3.parse(['input.txt', '-i', 'src', 'lib', '-e', 'test'])
      assert.deepStrictEqual(result3.arguments, ['input.txt'])
      assert.deepStrictEqual(result3.options.include, ['src', 'lib'])
      assert.deepStrictEqual(result3.options.exclude, ['test'])
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create command with all parameters', () => {
      const cmd = new Command('testapp', '2.0.0', 'Test application')
      expect(cmd.name).toBe('testapp')
      expect(cmd.version).toBe('2.0.0')
      expect(cmd.description).toBe('Test application')
      expect(cmd.arguments).toEqual([])
    })

    it('should use default version and description', () => {
      const cmd = new Command('testapp')
      expect(cmd.name).toBe('testapp')
      expect(cmd.version).toBe('0.0.0')
      expect(cmd.description).toBe('')
    })

    it('should use default description when only version provided', () => {
      const cmd = new Command('testapp', '1.5.0')
      expect(cmd.name).toBe('testapp')
      expect(cmd.version).toBe('1.5.0')
      expect(cmd.description).toBe('')
    })
  })

  describe(Command.prototype.argument.name, () => {
    describe('required arguments', () => {
      it('should add required argument', () => {
        const cmd = new Command('test')
        const result = cmd.argument('<input>', 'input file')

        expect(result).toBe(cmd) // Should return this for chaining
        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'input',
          description: 'input file',
          required: true,
          multiple: false,
        })
      })

      it('should add multiple required arguments in order', () => {
        const cmd = new Command('test')
          .argument('<first>', 'first argument')
          .argument('<second>', 'second argument')

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[0].name).toBe('first')
        expect(cmd.arguments[1].name).toBe('second')
      })

      it('should throw error when adding required after optional', () => {
        const cmd = new Command('test').argument('[optional]', 'optional argument')

        expect(() => {
          cmd.argument('<required>', 'required argument')
        }).toThrow('Cannot add required argument after optional or variadic arguments')
      })

      it('should throw error when adding required after variadic', () => {
        const cmd = new Command('test').argument('[files...]', 'variadic argument')

        expect(() => {
          cmd.argument('<required>', 'required argument')
        }).toThrow('Cannot add required argument after optional or variadic arguments')
      })
    })

    describe('optional arguments', () => {
      it('should add optional argument with default', () => {
        const cmd = new Command('test')
          .argument('<required>', 'required argument')
          .argument('[optional]', 'optional argument', { defaultValue: 'default' })

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[1]).toEqual({
          name: 'optional',
          description: 'optional argument',
          required: false,
          multiple: false,
          defaultValue: 'default',
        })
      })

      it('should use empty string as default when not provided', () => {
        const cmd = new Command('test').argument('[optional]', 'optional argument')

        expect(cmd.arguments[0].defaultValue).toBeUndefined()
      })

      it('should throw error when adding optional after variadic', () => {
        const cmd = new Command('test').argument('<files...>', 'variadic argument')

        expect(() => {
          cmd.argument('[optional]', 'optional argument')
        }).toThrow('Cannot add optional argument after variadic argument')
      })
    })

    describe('variadic arguments', () => {
      it('should add required variadic argument', () => {
        const cmd = new Command('test').argument('<files...>', 'input files')

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          description: 'input files',
          required: true,
          multiple: true,
        })
      })

      it('should add optional variadic argument with default', () => {
        const cmd = new Command('test').argument('[files...]', 'input files', { defaultValue: ['default.txt'] })

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          description: 'input files',
          required: false,
          multiple: true,
          defaultValue: ['default.txt'],
        })
      })

      it('should use empty array as default when not provided', () => {
        const cmd = new Command('test').argument('[files...]', 'input files')

        expect(cmd.arguments[0].defaultValue).toEqual([])
      })

      it('should throw error when adding multiple variadic arguments', () => {
        const cmd = new Command('test').argument('<files...>', 'first variadic')

        expect(() => {
          cmd.argument('<more...>', 'second variadic')
        }).toThrow('Cannot add more than one variadic argument')
      })
    })

    describe('validation', () => {
      it('should throw error for invalid argument format', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.argument('invalid' as any, 'description')
        }).toThrow('Invalid argument format: invalid')
      })

      it('should throw error for duplicate argument names', () => {
        const cmd = new Command('test').argument('<duplicate>', 'first')

        expect(() => {
          cmd.argument('<duplicate>', 'second')
        }).toThrow('Argument name already in use: duplicate')
      })

      it('should throw error when argument name conflicts with option name', () => {
        const cmd = new Command('test').option('-f, --file', 'file option')

        expect(() => {
          cmd.argument('<file>', 'file argument')
        }).toThrow('Argument name already in use: file')
      })
    })
  })

  describe(Command.prototype.option.name, () => {
    describe('boolean options', () => {
      it('should add boolean option', () => {
        const cmd = new Command('test')
        const countBuiltinOptions = cmd.options.length
        const result = cmd.option('-v, --verbose', 'verbose output')

        expect(result).toBe(cmd) // Should return this for chaining
        expect(cmd.options).toHaveLength(1 + countBuiltinOptions)
        expect(cmd.options.pop()).toEqual({
          type: 'boolean',
          short: 'v',
          name: 'verbose',
          description: 'verbose output',
          required: false,
          multiple: false,
        })
      })
    })

    describe('string options', () => {
      it('should add required string option', () => {
        const cmd = new Command('test').option('-f, --format <type>', 'output format')

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'f',
          argName: 'type',
          name: 'format',
          description: 'output format',
          required: true,
          multiple: false,
        })
      })

      it('should add optional string option with default', () => {
        const cmd = new Command('test').option('-o, --output [path]', 'output path', { defaultValue: 'dist' })

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'o',
          argName: 'path',
          name: 'output',
          description: 'output path',
          required: false,
          multiple: false,
          defaultValue: 'dist',
        })
      })

      it('should use undefined as default when not provided for optional', () => {
        const cmd = new Command('test').option('-o, --output [path]', 'output path')

        expect(cmd.options.pop()?.defaultValue).toBeUndefined()
      })
    })

    describe('variadic options', () => {
      it('should add required variadic option', () => {
        const cmd = new Command('test').option('-i, --include <patterns...>', 'include patterns')

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'i',
          argName: 'patterns',
          name: 'include',
          description: 'include patterns',
          required: true,
          multiple: true,
          defaultValue: undefined,
        })
      })

      it('should add optional variadic option with default', () => {
        const cmd = new Command('test').option('-e, --exclude [patterns...]', 'exclude patterns', {
          defaultValue: ['node_modules'],
        })

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'e',
          argName: 'patterns',
          name: 'exclude',
          description: 'exclude patterns',
          required: false,
          multiple: true,
          defaultValue: ['node_modules'],
        })
      })

      it('should use empty array as default when not provided', () => {
        const cmd = new Command('test').option('-e, --exclude [patterns...]', 'exclude patterns')

        expect(cmd.options.pop()?.defaultValue).toEqual([])
      })
    })

    describe('validation', () => {
      it('should throw error for invalid option format', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.option('invalid' as any, 'description')
        }).toThrow('Invalid option format: invalid')
      })

      it('should throw error for invalid short name', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.option('-12, --invalid', 'description')
        }).toThrow('Expected short name to be a single alpha-numeric character. Got: 12')
      })

      it('should throw error for duplicate option names', () => {
        const cmd = new Command('test').option('-v, --verbose', 'first')

        expect(() => {
          cmd.option('-d, --verbose', 'second')
        }).toThrow('Option name already in use: --verbose')
      })

      it('should throw error for duplicate short names', () => {
        const cmd = new Command('test').option('-v, --verbose', 'first')

        expect(() => {
          cmd.option('-v, --debug', 'second')
        }).toThrow('Option short name already in use: -v')
      })
    })
  })

  describe(Command.prototype.parse.name, () => {
    describe('argument parsing', () => {
      it('should parse required arguments', () => {
        const cmd = new Command('test').argument('<input>', 'input file').argument('<output>', 'output file')

        const result = cmd.parse(['in.txt', 'out.txt'])
        expect(result.arguments).toEqual(['in.txt', 'out.txt'])
      })

      it('should use defaults for missing optional arguments', () => {
        const cmd = new Command('test')
          .argument('<input>', 'input file')
          .argument('[output]', 'output file', { defaultValue: 'default.txt' })

        const result = cmd.parse(['in.txt'])
        expect(result.arguments).toEqual(['in.txt', 'default.txt'])
      })

      it('should parse variadic arguments', () => {
        const cmd = new Command('test').argument('<files...>', 'input files')

        const result = cmd.parse(['file1.txt', 'file2.txt', 'file3.txt'])
        expect(result.arguments).toEqual([['file1.txt', 'file2.txt', 'file3.txt']])
      })

      it('should handle mixed arguments and variadic', () => {
        const cmd = new Command('test').argument('<command>', 'command name').argument('<files...>', 'input files')

        const result = cmd.parse(['build', 'src/index.ts', 'src/utils.ts'])
        expect(result.arguments).toEqual(['build', ['src/index.ts', 'src/utils.ts']])
      })
    })

    describe('option parsing', () => {
      it('should parse boolean options', () => {
        const cmd = new Command('test')
          .option('-v, --verbose', 'verbose output')
          .option('-d, --debug', 'debug mode')

        const result = cmd.parse(['-v'])
        expect(result.options).toEqual({ verbose: true })
      })

      it('should parse string options', () => {
        const cmd = new Command('test').option('-f, --format <type>', 'output format')

        const result = cmd.parse(['-f', 'json'])
        expect(result.options).toEqual({ format: 'json' })
      })

      it('should parse long options', () => {
        const cmd = new Command('test').option('-f, --format <type>', 'output format')

        const result = cmd.parse(['--format', 'xml'])
        expect(result.options).toEqual({ format: 'xml' })
      })

      it('should handle optional string options with defaults', () => {
        const cmd = new Command('test').option('-o, --output [path]', 'output path', { defaultValue: 'dist' })

        const result1 = cmd.parse([])
        expect(result1.options).toEqual({ output: 'dist' })

        const result2 = cmd.parse(['-o', 'build'])
        expect(result2.options).toEqual({ output: 'build' })
      })
    })

    describe('combined parsing', () => {
      it('should parse arguments and options together', () => {
        const cmd = new Command('test')
          .argument('<input>', 'input file')
          .argument('[output]', 'output file', { defaultValue: 'out.txt' })
          .option('-v, --verbose', 'verbose output')
          .option('-f, --format <type>', 'output format')

        const result = cmd.parse(['in.txt', '-v', '-f', 'json'])
        expect(result.arguments).toEqual(['in.txt', 'out.txt'])
        expect(result.options).toEqual({ verbose: true, format: 'json' })
      })

      it('should handle complex command with all types', () => {
        const cmd = new Command('test')
          .argument('<command>', 'command name')
          .argument('[target]', 'target directory', { defaultValue: 'src' })
          .argument('[files...]', 'additional files')
          .option('-v, --verbose', 'verbose output')
          .option('-o, --output <dir>', 'output directory')
          .option('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules'] })

        const result = cmd.parse([
          'build',
          'dist',
          'extra1.js',
          'extra2.js',
          '-v',
          '-o',
          'build',
          '-e',
          'test',
          'docs',
        ])

        expect(result.arguments).toEqual(['build', 'dist', ['extra1.js', 'extra2.js']])
        expect(result.options).toEqual({
          verbose: true,
          output: 'build',
          exclude: ['test', 'docs'],
        })
      })
    })

    describe('edge cases', () => {
      it('should handle empty argv', () => {
        const cmd = new Command('test')
          .argument('[optional]', 'optional arg', { defaultValue: 'default' })
          .option('-v, --verbose', 'verbose')

        const result = cmd.parse([])
        expect(result.arguments).toEqual(['default'])
        expect(result.options).toEqual({})
      })

      it('should handle no arguments provided', () => {
        const cmd = new Command('test').option('-v, --verbose', 'verbose')

        const result = cmd.parse()
        expect(result.options).toEqual({})
      })
    })
  })

  describe('argument ordering enforcement', () => {
    it('should allow correct ordering: required -> optional -> variadic', () => {
      expect(() => {
        new Command('test')
          .argument('<required1>', 'first required')
          .argument('<required2>', 'second required')
          .argument('[optional]', 'optional arg')
          .argument('[variadic...]', 'variadic arg')
      }).not.toThrow()
    })

    it('should prevent required after optional', () => {
      expect(() => {
        new Command('test').argument('[optional]', 'optional arg').argument('<required>', 'required arg')
      }).toThrow('Cannot add required argument after optional or variadic arguments')
    })

    it('should prevent multiple variadic arguments', () => {
      expect(() => {
        new Command('test').argument('<first...>', 'first variadic').argument('<second...>', 'second variadic')
      }).toThrow('Cannot add more than one variadic argument')
    })
  })

  describe(Command.prototype.command.name, () => {
    it('should create subcommand with proper parent-child relationship', () => {
      const parent = new Command('parent', '1.0.0', 'Parent command')
      const child = parent.command('child', 'Child command')

      expect(child.name).toBe('child')
      expect(child.version).toBe('1.0.0') // Inherits parent version
      expect(child.description).toBe('Child command')
      expect(child.parent).toBe(parent)
      expect(parent.commands).toContain(child)
    })

    it('should use empty description when not provided', () => {
      const parent = new Command('parent')
      const child = parent.command('child')

      expect(child.description).toBe('')
    })
  })

  describe('globalOptions getter', () => {
    it('should return options from command and all ancestors', () => {
      const grandparent = new Command('grandparent').option('-a, --all', 'all flag')
      const parent = grandparent.command('parent').option('-v, --verbose', 'verbose flag')
      const child = parent.command('child').option('-d, --debug', 'debug flag')

      const globalOptions = child.globalOptions
      expect(globalOptions).toHaveLength(3)
      expect(globalOptions.map((o) => o.name)).toEqual(['debug', 'verbose', 'all'])
    })

    it('should return empty array for command with no options or parents', () => {
      const cmd = new Command('test')
      expect(cmd.globalOptions).toEqual([])
    })
  })

  describe('subcommand parsing', () => {
    it('should parse subcommand when present', () => {
      const parent = new Command('parent').option('-v, --verbose', 'verbose flag')
      const child = parent.command('child').argument('<input>', 'input file').option('-d, --debug', 'debug flag')

      const result = parent.parse(['child', 'input.txt', '-d'])

      expect(result.command).toBe(child)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ debug: true })
    })

    it('should pass global options to subcommand', () => {
      const parent = new Command('parent').option('-v, --verbose', 'verbose flag')
      const child = parent.command('child').argument('<input>', 'input file')

      const result = parent.parse(['child', 'input.txt', '-v'])

      expect(result.command).toBe(child)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ verbose: true })
    })

    it('should parse parent command when no subcommand matches', () => {
      const parent = new Command('parent')
        .argument('<input>', 'input file')
        .option('-v, --verbose', 'verbose flag')
      parent.command('child')

      const result = parent.parse(['input.txt', '-v'])

      expect(result.command).toBe(parent)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ verbose: true })
    })
  })

  describe('variadic option parsing', () => {
    it('should parse required variadic options correctly', () => {
      const cmd = new Command('test').option('-i, --include <patterns...>', 'include patterns')

      const result = cmd.parse(['-i', 'src', 'lib', 'test'])
      expect(result.options.include).toEqual(['src', 'lib', 'test'])
    })

    it('should parse optional variadic options correctly', () => {
      const cmd = new Command('test').option('-e, --exclude [patterns...]', 'exclude patterns', {
        defaultValue: ['node_modules'],
      })

      const result1 = cmd.parse([])
      expect(result1.options.exclude).toEqual(['node_modules'])

      const result2 = cmd.parse(['-e', 'test', 'docs'])
      expect(result2.options.exclude).toEqual(['test', 'docs'])
    })

    it('should handle variadic options mixed with arguments', () => {
      const cmd = new Command('test')
        .argument('<command>', 'command name')
        .argument('[files...]', 'input files')
        .option('-i, --include <patterns...>', 'include patterns')

      // Note: When using variadic options, the option consumes the following arguments
      // until another option or end of args. The remaining args go to variadic arguments.
      const result = cmd.parse(['build', '-i', 'src', 'lib'])
      expect(result.arguments).toEqual(['build', []])
      expect(result.options.include).toEqual(['src', 'lib'])
    })
  })

  describe(Command.prototype.findCommand.name, () => {
    it('should find command by name', () => {
      const parent = new Command('parent')
      const child = parent.command('child', 'Child command')

      expect(parent.findCommand('child')).toBe(child)
    })

    it('should find command by alias', () => {
      const parent = new Command('parent')
      const child = parent.command('child', 'Child command')
      child.aliases = ['c', 'ch']

      expect(parent.findCommand('c')).toBe(child)
      expect(parent.findCommand('ch')).toBe(child)
    })

    it('should return undefined for non-existent command', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(parent.findCommand('nonexistent')).toBeUndefined()
    })

    it('should return undefined for empty name', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(parent.findCommand('')).toBeUndefined()
    })
  })

  describe(Command.prototype.findOption.name, () => {
    it('should find option by long name', () => {
      const cmd = new Command('test').option('-v, --verbose', 'verbose flag')

      const option = cmd.findOption('verbose')
      expect(option?.name).toBe('verbose')
    })

    it('should find option by short name', () => {
      const cmd = new Command('test').option('-v, --verbose', 'verbose flag')

      const option = cmd.findOption('v')
      expect(option?.short).toBe('v')
    })

    it('should return undefined for non-existent option', () => {
      const cmd = new Command('test').option('-v, --verbose', 'verbose flag')

      expect(cmd.findOption('nonexistent')).toBeUndefined()
    })
  })

  describe(Command.prototype.getCommandAndAncestors.name, () => {
    it('should return command and all ancestors in order', () => {
      const grandparent = new Command('grandparent')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      const ancestors = child.getCommandAndAncestors()
      expect(ancestors).toEqual([child, parent, grandparent])
    })

    it('should return only self for command with no parents', () => {
      const cmd = new Command('test')
      const ancestors = cmd.getCommandAndAncestors()
      expect(ancestors).toEqual([cmd])
    })
  })

  describe(Command.prototype.getAncestors.name, () => {
    it('should return only ancestors, excluding self', () => {
      const grandparent = new Command('grandparent')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      const ancestors = child.getAncestors()
      expect(ancestors).toEqual([parent, grandparent])
    })

    it('should return empty array for command with no parents', () => {
      const cmd = new Command('test')
      const ancestors = cmd.getAncestors()
      expect(ancestors).toEqual([])
    })
  })

  describe('advanced option configurations', () => {
    it('should handle options with choices', () => {
      const cmd = new Command('test').option('-f, --format <type>', 'output format', {
        choices: ['json', 'xml', 'yaml'],
      })

      expect(cmd.options[0].choices).toEqual(['json', 'xml', 'yaml'])
    })

    it('should handle options with env variables', () => {
      const cmd = new Command('test').option('-t, --token <value>', 'auth token', { env: 'AUTH_TOKEN' })

      expect(cmd.options[0].env).toBe('AUTH_TOKEN')
    })

    it('should handle hidden options', () => {
      const cmd = new Command('test').option('-h, --hidden', 'hidden option', { hidden: true })

      expect(cmd.options[0].hidden).toBe(true)
    })

    it('should handle option groups', () => {
      const cmd = new Command('test').option('-v, --verbose', 'verbose flag', { group: 'logging' })

      expect(cmd.options[0].group).toBe('logging')
    })
  })

  describe('additional command properties', () => {
    it('should handle command aliases', () => {
      const cmd = new Command('test')
      cmd.aliases = ['t', 'tst']

      expect(cmd.aliases).toEqual(['t', 'tst'])
    })

    it('should handle command summary', () => {
      const cmd = new Command('test')
      cmd.summary = 'Test command summary'

      expect(cmd.summary).toBe('Test command summary')
    })

    it('should handle hidden commands', () => {
      const cmd = new Command('test')
      cmd.hidden = true

      expect(cmd.hidden).toBe(true)
    })

    it('should handle command groups', () => {
      const cmd = new Command('test')
      cmd.group = 'utilities'

      expect(cmd.group).toBe('utilities')
    })
  })

  describe('default value edge cases', () => {
    it('should handle undefined default values for optional arguments', () => {
      const cmd = new Command('test').argument('[optional]', 'optional argument')

      expect(cmd.arguments[0].defaultValue).toBeUndefined()
    })

    it('should handle undefined default values for optional options', () => {
      const cmd = new Command('test').option('-o, --output [path]', 'output path')

      expect(cmd.options[0].defaultValue).toBeUndefined()
    })

    it('should handle complex default values for variadic arguments', () => {
      const cmd = new Command('test').argument('[files...]', 'input files', { defaultValue: ['src/**/*.ts'] })

      expect(cmd.arguments[0].defaultValue).toEqual(['src/**/*.ts'])
    })
  })

  describe('validation error edge cases', () => {
    it('should allow option names that match argument names', () => {
      const cmd = new Command('test').argument('<file>', 'input file')

      expect(() => {
        cmd.option('-f, --file', 'file option')
      }).not.toThrow()
    })

    it('should validate short option names in parent-child hierarchy', () => {
      const parent = new Command('parent').option('-v, --verbose', 'verbose flag')
      const child = parent.command('child')

      expect(() => {
        child.option('-v, --debug', 'debug flag')
      }).toThrow('Option short name already in use: -v')
    })

    it('should validate long option names in parent-child hierarchy', () => {
      const parent = new Command('parent').option('-v, --verbose', 'verbose flag')
      const child = parent.command('child')

      expect(() => {
        child.option('-d, --verbose', 'debug flag')
      }).toThrow('Option name already in use: --verbose')
    })
  })

  describe('help configuration', () => {
    it('should have default help configuration', () => {
      const cmd = new Command('test')
      expect(cmd.helpConfiguration.showGlobalOptions).toBe(true)
    })

    it('should allow custom help configuration', () => {
      const cmd = new Command('test')
      cmd.helpConfiguration = { showGlobalOptions: false, sortOptions: true }

      expect(cmd.helpConfiguration.showGlobalOptions).toBe(false)
      expect(cmd.helpConfiguration.sortOptions).toBe(true)
    })
  })

  describe('parent property', () => {
    it('should have parent property as non-enumerable', () => {
      const parent = new Command('parent')
      const child = parent.command('child')

      const descriptor = Object.getOwnPropertyDescriptor(child, 'parent')
      expect(descriptor?.enumerable).toBe(false)
    })
  })

  describe(Command.prototype.renderHelp.name, () => {
    it('should render basic help with command info', () => {
      const cmd = new Command('myapp', '1.0.0', 'A test application')
      const helpDefinition = new CommandHelpDefinition()

      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('myapp')
      expect(help).toContain('A test application')
    })

    it('should render help with arguments and options', () => {
      const cmd = new Command('myapp', '1.0.0', 'A test application')
        .argument('<input>', 'input file')
        .argument('[output]', 'output file', { defaultValue: 'out.txt' })
        .option('-v, --verbose', 'verbose output')
        .option('-f, --format <type>', 'output format')

      const helpDefinition = new CommandHelpDefinition()
      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('<input>')
      expect(help).toContain('[output]')
      expect(help).toContain('-v, --verbose')
      expect(help).toContain('-f, --format')
    })

    it('should render help with subcommands', () => {
      const parent = new Command('myapp', '1.0.0', 'Parent command')
      parent.command('build', 'Build the project')
      parent.command('test', 'Run tests')

      const helpDefinition = new CommandHelpDefinition()
      const help = parent.renderHelp(helpDefinition)

      expect(help).toContain('build')
      expect(help).toContain('test')
    })

    it('should handle help configuration options', () => {
      const cmd = new Command('myapp').option('-v, --verbose', 'verbose output')
      cmd.helpConfiguration = { sortOptions: true }

      const helpDefinition = new CommandHelpDefinition()
      const help = cmd.renderHelp(helpDefinition)

      // Should not throw and should include the option
      expect(help).toContain('-v, --verbose')
    })
  })
})
