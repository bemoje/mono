import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Command } from './Command'
import { Help } from './Help'

describe(Command.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic command setup
      const cmd = new Command('myapp').setDescription('A test application')
      cmd.setVersion('1.0.0')
      cmd
        .addArgument('<input>', 'input file')
        .addArgument('[output]', 'output file', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format')

      assert.deepStrictEqual(cmd.name, 'myapp')
      assert.deepStrictEqual(cmd.version, '1.0.0')
      assert.deepStrictEqual(cmd.description, 'A test application')

      // Test parsing
      const result = cmd.parseArgv(['input.txt', '-v', '-f', 'json'])
      assert.deepStrictEqual(result.arguments, ['input.txt', 'out.txt'])
      assert.deepStrictEqual(result.options.verbose, true)
      assert.deepStrictEqual(result.options.format, 'json')

      // Variadic arguments
      const cmd2 = new Command('myapp2')
        .addArgument('<files...>', 'input files')
        .addOption('-o, --output [dir]', 'output directory', { defaultValue: 'dist' })

      const result2 = cmd2.parseArgv(['file1.txt', 'file2.txt', 'file3.txt'])
      assert.deepStrictEqual(result2.arguments, [['file1.txt', 'file2.txt', 'file3.txt']])
      assert.deepStrictEqual(result2.options.output, 'dist')

      // Variadic options
      const cmd3 = new Command('myapp3')
        .addArgument('<input>', 'input file')
        .addOption('-i, --include <patterns...>', 'include patterns')
        .addOption('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules'] })

      const result3 = cmd3.parseArgv(['input.txt', '-i', 'src', 'lib', '-e', 'test'])
      assert.deepStrictEqual(result3.arguments, ['input.txt'])
      assert.deepStrictEqual(result3.options.include, ['src', 'lib'])
      assert.deepStrictEqual(result3.options.exclude, ['test'])
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create command with all parameters', () => {
      const cmd = new Command('testapp')
      cmd.setVersion('2.0.0')
      expect(cmd.name).toBe('testapp')
      expect(cmd.version).toBe('2.0.0')
      expect(cmd.arguments).toEqual([])
    })

    it('should use default description and undefined version', () => {
      const cmd = new Command('testapp')
      expect(cmd.name).toBe('testapp')
      expect(cmd.version).toBeUndefined()
      expect(cmd.description).toBe('')
    })

    it('should set parent correctly when provided', () => {
      const parent = new Command('parent')
      const child = new Command('child', parent)
      expect(child.parent).toBe(parent)
    })

    it('should set parent to null when not provided', () => {
      const cmd = new Command('test')
      expect(cmd.parent).toBeNull()
    })
  })

  describe('setter methods', () => {
    describe(Command.prototype.setName.name, () => {
      it('should update command name', () => {
        const cmd = new Command('original')
        cmd.setName('updated')
        expect(cmd.name).toBe('updated')
      })
    })

    describe(Command.prototype.setAliases.name, () => {
      it('should set aliases from string array', () => {
        const cmd = new Command('test')
        const result = cmd.setAliases(['t', 'tst'])
        expect(cmd.aliases).toEqual(['t', 'tst'])
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should set aliases from nested arrays', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t'], ['tst', 'test-cmd'])
        expect(cmd.aliases).toEqual(['t', 'tst', 'test-cmd'])
      })

      it('should set aliases from mixed string and array arguments', () => {
        const cmd = new Command('test')
        cmd.setAliases('t', ['tst', 'test-cmd'], 'tc')
        expect(cmd.aliases).toEqual(['t', 'tst', 'test-cmd', 'tc'])
      })

      it('should handle empty aliases', () => {
        const cmd = new Command('test')
        cmd.setAliases()
        expect(cmd.aliases).toEqual([])
      })
    })

    describe(Command.prototype.addAliases.name, () => {
      it('should add aliases to existing ones', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t', 'tst'])
        const result = cmd.addAliases(['test-cmd', 'tc'])
        expect(cmd.aliases).toEqual(['t', 'tst', 'test-cmd', 'tc'])
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should add aliases from nested arrays', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t'])
        cmd.addAliases(['tst'], ['test-cmd', 'tc'])
        expect(cmd.aliases).toEqual(['t', 'tst', 'test-cmd', 'tc'])
      })

      it('should add aliases from mixed string and array arguments', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t'])
        cmd.addAliases('tst', ['test-cmd'], 'tc')
        expect(cmd.aliases).toEqual(['t', 'tst', 'test-cmd', 'tc'])
      })

      it('should handle adding empty aliases', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t', 'tst'])
        cmd.addAliases()
        expect(cmd.aliases).toEqual(['t', 'tst'])
      })

      it('should add to empty aliases array', () => {
        const cmd = new Command('test')
        cmd.addAliases(['first', 'second'])
        expect(cmd.aliases).toEqual(['first', 'second'])
      })
    })

    describe(Command.prototype.setVersion.name, () => {
      it('should set version when provided', () => {
        const cmd = new Command('test')
        const result = cmd.setVersion('1.2.3')
        expect(cmd.version).toBe('1.2.3')
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should set version to undefined when not provided', () => {
        const cmd = new Command('test')
        cmd.setVersion('1.0.0')
        cmd.setVersion()
        expect(cmd.version).toBeUndefined()
      })
    })

    describe(Command.prototype.setSummary.name, () => {
      it('should set summary when provided', () => {
        const cmd = new Command('test')
        const result = cmd.setSummary('Test summary')
        expect(cmd.summary).toBe('Test summary')
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should set summary to undefined when not provided', () => {
        const cmd = new Command('test')
        cmd.setSummary('Initial summary')
        cmd.setSummary()
        expect(cmd.summary).toBeUndefined()
      })
    })

    describe(Command.prototype.setDescription.name, () => {
      it('should set description from single line', () => {
        const cmd = new Command('test')
        const result = cmd.setDescription('Single line description')
        expect(cmd.description).toBe('Single line description')
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should join multiple lines with newlines', () => {
        const cmd = new Command('test')
        cmd.setDescription('Line 1', 'Line 2', 'Line 3')
        expect(cmd.description).toBe('Line 1\nLine 2\nLine 3')
      })

      it('should handle empty description', () => {
        const cmd = new Command('test')
        cmd.setDescription()
        expect(cmd.description).toBe('')
      })
    })

    describe(Command.prototype.setHidden.name, () => {
      it('should set hidden to true by default', () => {
        const cmd = new Command('test')
        const result = cmd.setHidden()
        expect(cmd.hidden).toBe(true)
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should set hidden to explicit value', () => {
        const cmd = new Command('test')
        cmd.setHidden(false)
        expect(cmd.hidden).toBe(false)
      })

      it('should set hidden to true when explicitly passed undefined', () => {
        const cmd = new Command('test')
        cmd.setHidden(undefined)
        expect(cmd.hidden).toBe(true) // setHidden defaults to true when passed undefined
      })
    })

    describe(Command.prototype.setGroup.name, () => {
      it('should set group when provided', () => {
        const cmd = new Command('test')
        const result = cmd.setGroup('utilities')
        expect(cmd.group).toBe('utilities')
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should set group to undefined when not provided', () => {
        const cmd = new Command('test')
        cmd.setGroup('initial')
        cmd.setGroup()
        expect(cmd.group).toBeUndefined()
      })
    })

    describe(Command.prototype.setParent.name, () => {
      it('should set parent command', () => {
        const parent = new Command('parent')
        const child = new Command('child')
        const result = child.setParent(parent)
        expect(child.parent).toBe(parent)
        expect(result).toBe(child) // Should return this for chaining
      })

      it('should set parent to null', () => {
        const parent = new Command('parent')
        const child = new Command('child', parent)
        child.setParent(null)
        expect(child.parent).toBeNull()
      })
    })

    describe(Command.prototype.setHelpConfiguration.name, () => {
      it('should set help configuration to provided value', () => {
        const cmd = new Command('test')
        const config = { showGlobalOptions: false, sortOptions: false }
        const result = cmd.setHelpConfiguration(config)
        expect(cmd.helpConfiguration).toEqual(config)
        expect(result).toBe(cmd) // Should return this for chaining
      })
    })
  })

  describe(Command.prototype.addArgument.name, () => {
    describe('required arguments', () => {
      it('should add required argument', () => {
        const cmd = new Command('test')
        const result = cmd.addArgument('<input>', 'input file')

        expect(result).toBe(cmd) // Should return this for chaining
        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'input',
          description: 'input file',
          required: true,
          variadic: false,
        })
      })

      it('should add multiple required arguments in order', () => {
        const cmd = new Command('test')
          .addArgument('<first>', 'first argument')
          .addArgument('<second>', 'second argument')

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[0].name).toBe('first')
        expect(cmd.arguments[1].name).toBe('second')
      })

      it('should throw error when adding required after optional', () => {
        const cmd = new Command('test').addArgument('[optional]', 'optional argument')

        expect(() => {
          cmd.addArgument('<required>', 'required argument')
        }).toThrow('Cannot add required argument after optional or variadic arguments')
      })

      it('should throw error when adding required after variadic', () => {
        const cmd = new Command('test').addArgument('[files...]', 'variadic argument')

        expect(() => {
          cmd.addArgument('<required>', 'required argument')
        }).toThrow('Cannot add required argument after optional or variadic arguments')
      })
    })

    describe('optional arguments', () => {
      it('should add optional argument with default', () => {
        const cmd = new Command('test')
          .addArgument('<required>', 'required argument')
          .addArgument('[optional]', 'optional argument', { defaultValue: 'default' })

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[1]).toEqual({
          name: 'optional',
          description: 'optional argument',
          required: false,
          variadic: false,
          defaultValue: 'default',
        })
      })

      it('should use empty string as default when not provided', () => {
        const cmd = new Command('test').addArgument('[optional]', 'optional argument')

        expect(cmd.arguments[0].defaultValue).toBeUndefined()
      })

      it('should throw error when adding optional after variadic', () => {
        const cmd = new Command('test').addArgument('<files...>', 'variadic argument')

        expect(() => {
          cmd.addArgument('[optional]', 'optional argument')
        }).toThrow('Cannot add optional argument after variadic argument')
      })
    })

    describe('variadic arguments', () => {
      it('should add required variadic argument', () => {
        const cmd = new Command('test').addArgument('<files...>', 'input files')

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          description: 'input files',
          required: true,
          variadic: true,
        })
      })

      it('should add optional variadic argument with default', () => {
        const cmd = new Command('test').addArgument('[files...]', 'input files', { defaultValue: ['default.txt'] })

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          description: 'input files',
          required: false,
          variadic: true,
          defaultValue: ['default.txt'],
        })
      })

      it('should use empty array as default when not provided', () => {
        const cmd = new Command('test').addArgument('[files...]', 'input files')

        expect(cmd.arguments[0].defaultValue).toEqual([])
      })

      it('should throw error when adding multiple variadic arguments', () => {
        const cmd = new Command('test').addArgument('<files...>', 'first variadic')

        expect(() => {
          cmd.addArgument('<more...>', 'second variadic')
        }).toThrow('Cannot add more than one variadic argument')
      })
    })

    describe('validation', () => {
      it('should throw error for invalid argument format', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addArgument('invalid' as any, 'description')
        }).toThrow('Invalid argument format: invalid')
      })

      it('should throw error for duplicate argument names', () => {
        const cmd = new Command('test').addArgument('<duplicate>', 'first')

        expect(() => {
          cmd.addArgument('<duplicate>', 'second')
        }).toThrow('Argument name already in use: duplicate')
      })

      it('should throw error when argument name conflicts with option name', () => {
        const cmd = new Command('test').addOption('-f, --file', 'file option')

        expect(() => {
          cmd.addArgument('<file>', 'file argument')
        }).toThrow('Argument name already in use: file')
      })
    })
  })

  describe(Command.prototype.addOption.name, () => {
    describe('boolean options', () => {
      it('should add boolean option', () => {
        const cmd = new Command('test')
        const countBuiltinOptions = cmd.options.length
        const result = cmd.addOption('-v, --verbose', 'verbose output')

        expect(result).toBe(cmd) // Should return this for chaining
        expect(cmd.options).toHaveLength(1 + countBuiltinOptions)
        expect(cmd.options.pop()).toEqual({
          type: 'boolean',
          short: 'v',
          flags: '-v, --verbose',
          long: 'verbose',
          multiple: false,
          name: 'verbose',
          negate: false,
          optional: true,
          description: 'verbose output',
          variadic: false,
        })
      })
    })

    describe('string options', () => {
      it('should add required string option', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', 'output format')

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'f',
          argName: 'type',
          flags: '-f, --format <type>',
          long: 'format',
          multiple: false,
          name: 'format',
          optional: false,
          description: 'output format',
          required: true,
          variadic: false,
        })
      })

      it('should add optional string option with default', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path', { defaultValue: 'dist' })

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'o',
          argName: 'path',
          flags: '-o, --output [path]',
          long: 'output',
          multiple: false,
          name: 'output',
          optional: true,
          description: 'output path',
          required: false,
          variadic: false,
          defaultValue: 'dist',
        })
      })

      it('should use undefined as default when not provided for optional', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path')

        expect(cmd.options.pop()?.defaultValue).toBeUndefined()
      })
    })

    describe('variadic options', () => {
      it('should add required variadic option', () => {
        const cmd = new Command('test').addOption('-i, --include <patterns...>', 'include patterns')

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          short: 'i',
          argName: 'patterns',
          flags: '-i, --include <patterns...>',
          long: 'include',
          multiple: true,
          name: 'include',
          optional: false,
          description: 'include patterns',
          required: true,
          variadic: true,
        })
      })

      it('should add optional variadic option with default', () => {
        const cmd = new Command('test').addOption('-e, --exclude [patterns...]', 'exclude patterns', {
          defaultValue: ['node_modules'],
        })

        expect(cmd.options.pop()).toEqual({
          type: 'string',
          flags: '-e, --exclude [patterns...]',
          short: 'e',
          argName: 'patterns',
          long: 'exclude',
          multiple: true,
          name: 'exclude',
          optional: true,
          description: 'exclude patterns',
          required: false,
          variadic: true,
          defaultValue: ['node_modules'],
        })
      })

      it('should use empty array as default when not provided', () => {
        const cmd = new Command('test').addOption('-e, --exclude [patterns...]', 'exclude patterns')

        expect(cmd.options.pop()?.defaultValue).toEqual([])
      })
    })

    describe('validation', () => {
      it('should throw error for invalid option format', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addOption('invalid' as any, 'description')
        }).toThrow('Invalid option format: invalid')
      })

      it('should throw error for invalid short name', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addOption('-12, --invalid', 'description')
        }).toThrow('Expected short name to be a single alpha-numeric character. Got: 12')
      })

      it('should throw error for duplicate option names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'first')

        expect(() => {
          cmd.addOption('-d, --verbose', 'second')
        }).toThrow('Option name already in use: --verbose')
      })

      it('should throw error for duplicate short names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'first')

        expect(() => {
          cmd.addOption('-v, --debug', 'second')
        }).toThrow('Option short name already in use: -v')
      })
    })
  })

  describe(Command.prototype.parseArgv.name, () => {
    describe('argument parsing', () => {
      it('should parse required arguments', () => {
        const cmd = new Command('test').addArgument('<input>', 'input file').addArgument('<output>', 'output file')

        const result = cmd.parseArgv(['in.txt', 'out.txt'])
        expect(result.arguments).toEqual(['in.txt', 'out.txt'])
      })

      it('should use defaults for missing optional arguments', () => {
        const cmd = new Command('test')
          .addArgument('<input>', 'input file')
          .addArgument('[output]', 'output file', { defaultValue: 'default.txt' })

        const result = cmd.parseArgv(['in.txt'])
        expect(result.arguments).toEqual(['in.txt', 'default.txt'])
      })

      it('should parse variadic arguments', () => {
        const cmd = new Command('test').addArgument('<files...>', 'input files')

        const result = cmd.parseArgv(['file1.txt', 'file2.txt', 'file3.txt'])
        expect(result.arguments).toEqual([['file1.txt', 'file2.txt', 'file3.txt']])
      })

      it('should handle mixed arguments and variadic', () => {
        const cmd = new Command('test')
          .addArgument('<command>', 'command name')
          .addArgument('<files...>', 'input files')

        const result = cmd.parseArgv(['build', 'src/index.ts', 'src/utils.ts'])
        expect(result.arguments).toEqual(['build', ['src/index.ts', 'src/utils.ts']])
      })
    })

    describe('option parsing', () => {
      it('should parse boolean options', () => {
        const cmd = new Command('test')
          .addOption('-v, --verbose', 'verbose output')
          .addOption('-d, --debug', 'debug mode')

        const result = cmd.parseArgv(['-v'])
        expect(result.options).toEqual({ verbose: true })
      })

      it('should parse string options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['-f', 'json'])
        expect(result.options).toEqual({ format: 'json' })
      })

      it('should parse long options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['--format', 'xml'])
        expect(result.options).toEqual({ format: 'xml' })
      })

      it('should handle optional string options with defaults', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path', { defaultValue: 'dist' })

        const result1 = cmd.parseArgv([])
        expect(result1.options).toEqual({ output: 'dist' })

        const result2 = cmd.parseArgv(['-o', 'build'])
        expect(result2.options).toEqual({ output: 'build' })
      })
    })

    describe('combined parsing', () => {
      it('should parse arguments and options together', () => {
        const cmd = new Command('test')
          .addArgument('<input>', 'input file')
          .addArgument('[output]', 'output file', { defaultValue: 'out.txt' })
          .addOption('-v, --verbose', 'verbose output')
          .addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['in.txt', '-v', '-f', 'json'])
        expect(result.arguments).toEqual(['in.txt', 'out.txt'])
        expect(result.options).toEqual({ verbose: true, format: 'json' })
      })

      it('should handle complex command with all types', () => {
        const cmd = new Command('test')
          .addArgument('<command>', 'command name')
          .addArgument('[target]', 'target directory', { defaultValue: 'src' })
          .addArgument('[files...]', 'additional files')
          .addOption('-v, --verbose', 'verbose output')
          .addOption('-o, --output <dir>', 'output directory')
          .addOption('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules'] })

        const result = cmd.parseArgv([
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
          .addArgument('[optional]', 'optional arg', { defaultValue: 'default' })
          .addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv([])
        expect(result.arguments).toEqual(['default'])
        expect(result.options).toEqual({})
      })

      it('should handle no arguments provided', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv()
        expect(result.options).toEqual({})
      })

      it('should handle parsing with undefined argv', () => {
        const cmd = new Command('test')
          .addArgument('[optional]', 'optional arg', { defaultValue: 'default' })
          .addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv(undefined as any)
        expect(result.arguments).toEqual(['default'])
        expect(result.options).toEqual({})
      })

      it('should handle complex default value scenarios', () => {
        const cmd = new Command('test')
          .addArgument('[files...]', 'input files', { defaultValue: ['default1.txt', 'default2.txt'] })
          .addOption('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules', 'dist'] })

        const result = cmd.parseArgv([])
        expect(result.arguments).toEqual([['default1.txt', 'default2.txt']])
        expect(result.options.exclude).toEqual(['node_modules', 'dist'])
      })

      it('should handle mixed positional and variadic parsing correctly', () => {
        const cmd = new Command('test')
          .addArgument('<command>', 'command name')
          .addArgument('<target>', 'target file')
          .addArgument('[additional...]', 'additional files')
          .addOption('-v, --verbose', 'verbose output')

        const result = cmd.parseArgv(['build', 'src/index.ts', 'src/utils.ts', 'src/types.ts', '-v'])
        expect(result.arguments).toEqual(['build', 'src/index.ts', ['src/utils.ts', 'src/types.ts']])
        expect(result.options.verbose).toBe(true)
      })

      it('should handle options that expect a value', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path')

        const result = cmd.parseArgv(['-o', 'dist'])
        expect(result.options.output).toBe('dist')
      })
    })
  })

  describe('argument ordering enforcement', () => {
    it('should allow correct ordering: required -> optional -> variadic', () => {
      expect(() => {
        new Command('test')
          .addArgument('<required1>', 'first required')
          .addArgument('<required2>', 'second required')
          .addArgument('[optional]', 'optional arg')
          .addArgument('[variadic...]', 'variadic arg')
      }).not.toThrow()
    })

    it('should prevent required after optional', () => {
      expect(() => {
        new Command('test').addArgument('[optional]', 'optional arg').addArgument('<required>', 'required arg')
      }).toThrow('Cannot add required argument after optional or variadic arguments')
    })

    it('should prevent multiple variadic arguments', () => {
      expect(() => {
        new Command('test')
          .addArgument('<first...>', 'first variadic')
          .addArgument('<second...>', 'second variadic')
      }).toThrow('Cannot add more than one variadic argument')
    })
  })

  describe(Command.prototype.addSubcommand.name, () => {
    it('should create subcommand with proper parent-child relationship', () => {
      const parent = new Command('parent')
      parent.setVersion('1.0.0')
      const child = parent.addSubcommand('child')

      expect(child.name).toBe('child')
      expect(child.version).toBeUndefined() // Does not inherit parent version
      expect(child.parent).toBe(parent)
      expect(parent.commands).toContain(child)
    })

    it('should use empty description when not provided', () => {
      const parent = new Command('parent')
      const child = parent.addSubcommand('child')

      expect(child.description).toBe('')
    })
  })

  describe('globalOptions getter', () => {
    it('should return options from command and all ancestors', () => {
      const grandparent = new Command('grandparent').addOption('-a, --all', 'all flag')
      const parent = grandparent.addSubcommand('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.addSubcommand('child').addOption('-d, --debug', 'debug flag')

      const globalOptions = child.getOptionsInclAncestors()
      expect(globalOptions).toHaveLength(3)
      expect(globalOptions.map((o) => o.name)).toEqual(['debug', 'verbose', 'all'])
    })

    it('should return empty array for command with no options or parents', () => {
      const cmd = new Command('test')
      expect(cmd.getOptionsInclAncestors()).toEqual([])
    })
  })

  describe(Command.prototype.getOptionsInclAncestors.name, () => {
    it('should return options from command and all ancestors', () => {
      const grandparent = new Command('grandparent').addOption('-a, --all', 'all flag')
      const parent = grandparent.addSubcommand('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.addSubcommand('child').addOption('-d, --debug', 'debug flag')

      const globalOptions = child.getOptionsInclAncestors()
      expect(globalOptions).toHaveLength(3)
      expect(globalOptions.map((o) => o.name)).toEqual(['debug', 'verbose', 'all'])
    })

    it('should return only own options for command with no parents', () => {
      const cmd = new Command('test')
        .addOption('-v, --verbose', 'verbose flag')
        .addOption('-d, --debug', 'debug flag')

      const options = cmd.getOptionsInclAncestors()
      expect(options).toHaveLength(2)
      expect(options.map((o) => o.name)).toEqual(['verbose', 'debug'])
    })

    it('should return empty array for command with no options or parents', () => {
      const cmd = new Command('test')
      expect(cmd.getOptionsInclAncestors()).toEqual([])
    })

    it('should include global options from multiple ancestor levels', () => {
      const root = new Command('root').addOption('-r, --root', 'root flag')
      const level1 = root.addSubcommand('level1').addOption('-a, --level1', 'level1 flag')
      const level2 = level1.addSubcommand('level2').addOption('-b, --level2', 'level2 flag')
      const leaf = level2.addSubcommand('leaf').addOption('-c, --leaf', 'leaf flag')

      const options = leaf.getOptionsInclAncestors()
      expect(options).toHaveLength(4)
      expect(options.map((o) => o.name)).toEqual(['leaf', 'level2', 'level1', 'root'])
    })
  })

  describe('getter properties', () => {
    it('should return correct property values', () => {
      const parent = new Command('parent')
      const cmd = new Command('test', parent)
      cmd.setVersion('1.0.0')
      cmd.setAliases(['t', 'tst'])
      cmd.setSummary('Test summary')
      cmd.setDescription('Test description')
      cmd.setHidden(true)
      cmd.setGroup('utilities')
      cmd.addArgument('<input>', 'input file')
      cmd.addOption('-v, --verbose', 'verbose output')
      const child = cmd.addSubcommand('child')

      expect(cmd.name).toBe('test')
      expect(cmd.version).toBe('1.0.0')
      expect(cmd.aliases).toEqual(['t', 'tst'])
      expect(cmd.summary).toBe('Test summary')
      expect(cmd.description).toBe('Test description')
      expect(cmd.hidden).toBe(true)
      expect(cmd.group).toBe('utilities')
      expect(cmd.parent).toBe(parent)
      expect(cmd.commands).toContain(child)
      expect(cmd.arguments).toHaveLength(1)
      expect(cmd.options).toHaveLength(1)
      expect(cmd.helpConfiguration.showGlobalOptions).toBe(true)
    })
  })

  describe('protected method validation', () => {
    it('should validate option matching correctly', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')
      const option = cmd.options[0]

      // Access the protected method via the public findOption method which uses it
      expect(cmd.findOption('v')).toBe(option)
      expect(cmd.findOption('verbose')).toBe(option)
      expect(cmd.findOption('invalid')).toBeUndefined()
    })
  })

  describe('subcommand parsing', () => {
    it('should parse subcommand when present', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent
        .addSubcommand('child')
        .addArgument('<input>', 'input file')
        .addOption('-d, --debug', 'debug flag')

      const result = parent.parseArgv(['child', 'input.txt', '-d'])

      expect(result.command).toBe(child)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ debug: true })
    })

    it('should pass global options to subcommand', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.addSubcommand('child').addArgument('<input>', 'input file')

      const result = parent.parseArgv(['child', 'input.txt', '-v'])

      expect(result.command).toBe(child)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ verbose: true })
    })

    it('should parse parent command when no subcommand matches', () => {
      const parent = new Command('parent')
        .addArgument('<input>', 'input file')
        .addOption('-v, --verbose', 'verbose flag')
      parent.addSubcommand('child')

      const result = parent.parseArgv(['input.txt', '-v'])

      expect(result.command).toBe(parent)
      expect(result.arguments).toEqual(['input.txt'])
      expect(result.options).toEqual({ verbose: true })
    })
  })

  describe('variadic option parsing', () => {
    it('should parse required variadic options correctly', () => {
      const cmd = new Command('test').addOption('-i, --include <patterns...>', 'include patterns')

      const result = cmd.parseArgv(['-i', 'src', 'lib', 'test'])
      expect(result.options.include).toEqual(['src', 'lib', 'test'])
    })

    it('should parse optional variadic options correctly', () => {
      const cmd = new Command('test').addOption('-e, --exclude [patterns...]', 'exclude patterns', {
        defaultValue: ['node_modules'],
      })

      const result1 = cmd.parseArgv([])
      expect(result1.options.exclude).toEqual(['node_modules'])

      const result2 = cmd.parseArgv(['-e', 'test', 'docs'])
      expect(result2.options.exclude).toEqual(['test', 'docs'])
    })

    it('should handle variadic options mixed with arguments', () => {
      const cmd = new Command('test')
        .addArgument('<command>', 'command name')
        .addArgument('[files...]', 'input files')
        .addOption('-i, --include <patterns...>', 'include patterns')

      // Note: When using variadic options, the option consumes the following arguments
      // until another option or end of args. The remaining args go to variadic arguments.
      const result = cmd.parseArgv(['build', '-i', 'src', 'lib'])
      expect(result.arguments).toEqual(['build', []])
      expect(result.options.include).toEqual(['src', 'lib'])
    })
  })

  describe(Command.prototype.findCommand.name, () => {
    it('should find command by name', () => {
      const parent = new Command('parent')
      const child = parent.addSubcommand('child')

      expect(parent.findCommand('child')).toBe(child)
    })

    it('should find command by alias', () => {
      const parent = new Command('parent')
      const child = parent.addSubcommand('child')
      child.setAliases(['c', 'ch'])

      expect(parent.findCommand('c')).toBe(child)
      expect(parent.findCommand('ch')).toBe(child)
    })

    it('should return undefined for non-existent command', () => {
      const parent = new Command('parent')
      parent.addSubcommand('child')

      expect(parent.findCommand('nonexistent')).toBeUndefined()
    })

    it('should return undefined for empty name', () => {
      const parent = new Command('parent')
      parent.addSubcommand('child')

      expect(parent.findCommand('')).toBeUndefined()
    })
  })

  describe(Command.prototype.findOption.name, () => {
    it('should find option by long name', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      const option = cmd.findOption('verbose')
      expect(option?.name).toBe('verbose')
    })

    it('should find option by short name', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      const option = cmd.findOption('v')
      expect(option?.short).toBe('v')
    })

    it('should return undefined for non-existent option', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      expect(cmd.findOption('nonexistent')).toBeUndefined()
    })
  })

  describe(Command.prototype.getCommandAndAncestors.name, () => {
    it('should return command and all ancestors in order', () => {
      const grandparent = new Command('grandparent')
      const parent = grandparent.addSubcommand('parent')
      const child = parent.addSubcommand('child')

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
      const parent = grandparent.addSubcommand('parent')
      const child = parent.addSubcommand('child')

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
      const cmd = new Command('test').addOption('-f, --format <type>', 'output format', {
        choices: ['json', 'xml', 'yaml'],
      })

      expect(cmd.options[0].choices).toEqual(['json', 'xml', 'yaml'])
    })

    it('should handle options with env variables', () => {
      const cmd = new Command('test').addOption('-t, --token <value>', 'auth token', { env: 'AUTH_TOKEN' })

      expect(cmd.options[0].env).toBe('AUTH_TOKEN')
    })

    it('should handle hidden options', () => {
      const cmd = new Command('test').addOption('-h, --hidden', 'hidden option', { hidden: true })

      expect(cmd.options[0].hidden).toBe(true)
    })

    it('should handle option groups', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag', { group: 'logging' })

      expect(cmd.options[0].group).toBe('logging')
    })
  })

  describe('additional command properties', () => {
    it('should handle command aliases', () => {
      const cmd = new Command('test')
      cmd.setAliases(['t', 'tst'])

      expect(cmd.aliases).toEqual(['t', 'tst'])
    })

    it('should handle command summary', () => {
      const cmd = new Command('test')
      cmd.setSummary('Test command summary')

      expect(cmd.summary).toBe('Test command summary')
    })

    it('should handle hidden commands', () => {
      const cmd = new Command('test')
      cmd.setHidden(true)

      expect(cmd.hidden).toBe(true)
    })

    it('should handle command groups', () => {
      const cmd = new Command('test')
      cmd.setGroup('utilities')

      expect(cmd.group).toBe('utilities')
    })
  })

  describe('default value edge cases', () => {
    it('should handle undefined default values for optional arguments', () => {
      const cmd = new Command('test').addArgument('[optional]', 'optional argument')

      expect(cmd.arguments[0].defaultValue).toBeUndefined()
    })

    it('should handle undefined default values for optional options', () => {
      const cmd = new Command('test').addOption('-o, --output [path]', 'output path')

      expect(cmd.options[0].defaultValue).toBeUndefined()
    })

    it('should handle complex default values for variadic arguments', () => {
      const cmd = new Command('test').addArgument('[files...]', 'input files', { defaultValue: ['src/**/*.ts'] })

      expect(cmd.arguments[0].defaultValue).toEqual(['src/**/*.ts'])
    })
  })

  describe('validation error edge cases', () => {
    it('should allow option names that match argument names', () => {
      const cmd = new Command('test').addArgument('<file>', 'input file')

      expect(() => {
        cmd.addOption('-f, --file', 'file option')
      }).not.toThrow()
    })

    it('should validate short option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.addSubcommand('child')

      expect(() => {
        child.addOption('-v, --debug', 'debug flag')
      }).toThrow('Option short name already in use: -v')
    })

    it('should validate long option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.addSubcommand('child')

      expect(() => {
        child.addOption('-d, --verbose', 'debug flag')
      }).toThrow('Option name already in use: --verbose')
    })

    it('should validate option short names are alphanumeric', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('---, --invalid', 'invalid short name')
      }).toThrow('Expected short name to be a single alpha-numeric character. Got: --')
    })

    it('should validate option short names are single characters', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('-ab, --invalid', 'invalid short name')
      }).toThrow('Expected short name to be a single alpha-numeric character. Got: ab')
    })

    it('should validate argument names do not conflict with existing options', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      expect(() => {
        cmd.addArgument('<verbose>', 'verbose argument')
      }).toThrow('Argument name already in use: verbose')
    })

    it('should validate option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', 'global flag')
      const parent = grandparent.addSubcommand('parent')
      const child = parent.addSubcommand('child')

      expect(() => {
        child.addOption('-l, --global', 'local flag')
      }).toThrow('Option name already in use: --global')
    })

    it('should validate short option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', 'global flag')
      const parent = grandparent.addSubcommand('parent')
      const child = parent.addSubcommand('child')

      expect(() => {
        child.addOption('-g, --local', 'local flag')
      }).toThrow('Option short name already in use: -g')
    })
  })

  describe('command hierarchy edge cases', () => {
    it('should handle commands with aliases in subcommand parsing', () => {
      const parent = new Command('parent')
      const child = parent.addSubcommand('child')
      child.setAliases(['c', 'ch'])
      child.addArgument('<input>', 'input file')

      const result1 = parent.parseArgv(['c', 'input.txt'])
      expect(result1.command).toBe(child)
      expect(result1.arguments).toEqual(['input.txt'])

      const result2 = parent.parseArgv(['ch', 'input.txt'])
      expect(result2.command).toBe(child)
      expect(result2.arguments).toEqual(['input.txt'])
    })

    it('should handle empty command name in findCommand', () => {
      const parent = new Command('parent')
      parent.addSubcommand('child')

      expect(parent.findCommand('')).toBeUndefined()
    })

    it('should handle null command name in findCommand', () => {
      const parent = new Command('parent')
      parent.addSubcommand('child')

      expect(parent.findCommand(null as any)).toBeUndefined()
    })
  })

  describe('help configuration', () => {
    it('should have default help configuration', () => {
      const cmd = new Command('test')
      expect(cmd.helpConfiguration.showGlobalOptions).toBe(true)
    })

    it('should allow custom help configuration', () => {
      const cmd = new Command('test')
      cmd.extendHelpConfiguration({ showGlobalOptions: false, sortOptions: true })

      expect(cmd.helpConfiguration.showGlobalOptions).toBe(false)
      expect(cmd.helpConfiguration.sortOptions).toBe(true)
    })
  })

  describe(Command.prototype.renderHelp.name, () => {
    it('should render basic help with command info', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      const helpDefinition = new Help()

      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('myapp')
    })

    it('should render help with arguments and options', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      cmd
        .addArgument('<input>', 'input file')
        .addArgument('[output]', 'output file', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format')

      const helpDefinition = new Help()
      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('<input>')
      expect(help).toContain('[output]')
      expect(help).toContain('-v, --verbose')
      expect(help).toContain('-f, --format')
    })

    it('should render help with subcommands', () => {
      const parent = new Command('myapp')
      parent.setVersion('1.0.0')
      parent.addSubcommand('build')
      parent.addSubcommand('test')

      const helpDefinition = new Help()
      const help = parent.renderHelp(helpDefinition)

      expect(help).toContain('build')
      expect(help).toContain('test')
    })

    it('should handle help configuration options', () => {
      const cmd = new Command('myapp').addOption('-v, --verbose', 'verbose output')
      cmd.extendHelpConfiguration({ sortOptions: true })

      const helpDefinition = new Help()
      const help = cmd.renderHelp(helpDefinition)

      // Should not throw and should include the option
      expect(help).toContain('-v, --verbose')
    })

    it('should render help with variadic arguments and options', () => {
      const cmd = new Command('myapp')
      cmd
        .addArgument('<files...>', 'input files')
        .addOption('-i, --include <patterns...>', 'include patterns')
        .addOption('-e, --exclude [patterns...]', 'exclude patterns')

      const helpDefinition = new Help()
      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('<files...>')
      expect(help).toContain('<patterns...>')
      expect(help).toContain('[patterns...]')
    })

    it('should render help with complex command structure', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      cmd.setSummary('A test application')
      cmd.setDescription('This is a test application', 'with multiple lines of description')
      cmd.setGroup('tools')
      cmd
        .addArgument('<command>', 'command to run')
        .addArgument('[target]', 'target directory', { defaultValue: 'src' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format', { choices: ['json', 'xml'] })
        .addOption('-o, --output [path]', 'output path', { defaultValue: 'dist' })

      const build = cmd.addSubcommand('build')
      build.setSummary('Build the project')
      build.addArgument('<source>', 'source directory')

      const helpDefinition = new Help()
      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('myapp')
      expect(help).toContain('This is a test application') // The summary might not be in the help if description is present
      expect(help).toContain('build')
    })

    it('should handle help configuration merging', () => {
      const cmd = new Command('myapp')
      cmd.extendHelpConfiguration({
        showGlobalOptions: false,
        sortOptions: false,
      })
      cmd.addOption('-z, --zebra', 'zebra option')
      cmd.addOption('-a, --alpha', 'alpha option')

      const helpDefinition = new Help()
      const help = cmd.renderHelp(helpDefinition)

      expect(help).toContain('-z, --zebra')
      expect(help).toContain('-a, --alpha')
    })
  })
})
