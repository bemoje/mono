import { describe, expect, it, vi } from 'vitest'
import assert from 'node:assert'
import { Command } from './Command'
import { getCommandAndAncestors } from './helpers/getCommandAndAncestors'
import { getCommandAncestors } from './helpers/getCommandAncestors'
import { findSubcommand } from './helpers/findSubcommand'
import { findOption } from './helpers/findOption'

describe(Command.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic command setup
      const cmd = new Command('myapp')
        .setDescription('A test application')
        .setVersion('1.0.0')
        .addArgument('<input>')
        .addArgument('[output]', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format')

      assert.deepStrictEqual(cmd.name, 'myapp')
      assert.deepStrictEqual(cmd.version, '1.0.0')
      assert.deepStrictEqual(cmd.description, 'A test application')

      // Test parsing
      const result = cmd.parseArgv(['input.txt', '-v', '-f', 'json'])
      assert.deepStrictEqual(result.args, ['input.txt', 'out.txt'])
      assert.deepStrictEqual(result.opts.verbose, true)
      assert.deepStrictEqual(result.opts.format, 'json')

      // Variadic arguments
      const cmd2 = new Command('myapp2')
        .addArgument('<files...>')
        .addOption('-o, --output [dir]', 'output directory', { defaultValue: 'dist' })

      const result2 = cmd2.parseArgv(['file1.txt', 'file2.txt', 'file3.txt'])
      assert.deepStrictEqual(result2.args, [['file1.txt', 'file2.txt', 'file3.txt']])
      assert.deepStrictEqual(result2.opts.output, 'dist')

      // Variadic options
      const cmd3 = new Command('myapp3')
        .addArgument('<input>')
        .addOption('-i, --include <patterns...>', 'include patterns')
        .addOption('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules'] })

      const result3 = cmd3.parseArgv(['input.txt', '-i', 'src', 'lib', '-e', 'test'])
      assert.deepStrictEqual(result3.args, ['input.txt'])
      assert.deepStrictEqual(result3.opts.include, ['src', 'lib'])
      assert.deepStrictEqual(result3.opts.exclude, ['test'])
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
      expect(cmd.parent).toBeUndefined()
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

      it('should add version option', () => {
        const cmd = new Command('test')
        cmd.setVersion('1.2.3')
        expect(cmd.options.filter((option) => option.name === 'version')).toHaveLength(1)
      })

      it('should not add version option more than once', () => {
        const cmd = new Command('test')
        cmd.setVersion('1.2.3')
        cmd.setVersion('1.2.3')
        expect(cmd.options.filter((option) => option.name === 'version')).toHaveLength(1)
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
  })

  describe(Command.prototype.addArgument.name, () => {
    describe('required arguments', () => {
      it('should add required argument', () => {
        const cmd = new Command('test')
        const result = cmd.addArgument('<input>')

        expect(result).toBe(cmd) // Should return this for chaining
        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'input',
          usage: '<input>',
          required: true,
          variadic: false,
        })
      })

      it('should add argument without description', () => {
        const cmd = new Command('test').addArgument('<input>')
        expect(cmd.arguments[0].description).toBe(undefined)
      })

      it('should add multiple required arguments in order', () => {
        const cmd = new Command('test').addArgument('<first>').addArgument('<second>')

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[0].name).toBe('first')
        expect(cmd.arguments[1].name).toBe('second')
      })

      it('should throw error when adding required after optional', () => {
        const cmd = new Command('test').addArgument('[optional]')

        expect(() => {
          // @ts-expect-error
          cmd.addArgument('<required>', 'required argument')
        }).toThrow()
      })

      it('should throw error when adding required after variadic', () => {
        const cmd = new Command('test').addArgument('[files...]')

        expect(() => {
          // @ts-expect-error
          cmd.addArgument('<required>', 'required argument')
        }).toThrow()
      })
    })

    describe('optional arguments', () => {
      it('should add optional argument with default', () => {
        const cmd = new Command('test')
          .addArgument('<required>')
          .addArgument('[optional]', { defaultValue: 'default' })

        expect(cmd.arguments).toHaveLength(2)
        expect(cmd.arguments[1]).toEqual({
          name: 'optional',
          usage: '[optional]',
          defaultValue: 'default',
          required: false,
          variadic: false,
        })
      })

      it('should use empty string as default when not provided', () => {
        const cmd = new Command('test').addArgument('[optional]')

        expect(cmd.arguments[0].defaultValue).toBeUndefined()
      })

      it('should throw error when adding optional after variadic', () => {
        const cmd = new Command('test').addArgument('<files...>')

        expect(() => {
          // @ts-expect-error
          cmd.addArgument('[optional]')
        }).toThrow()
      })
    })

    describe('variadic arguments', () => {
      it('should add required variadic argument', () => {
        const cmd = new Command('test').addArgument('<files...>')

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          usage: '<files...>',
          required: true,
          variadic: true,
        })
      })

      it('should add optional variadic argument with default', () => {
        const cmd = new Command('test').addArgument('[files...]', { defaultValue: ['default.txt'] })

        expect(cmd.arguments).toHaveLength(1)
        expect(cmd.arguments[0]).toEqual({
          name: 'files',
          required: false,
          variadic: true,
          usage: '[files...]',
          defaultValue: ['default.txt'],
        })
      })

      it('should use empty array as default when not provided', () => {
        const cmd = new Command('test').addArgument('[files...]')

        expect(cmd.arguments[0].defaultValue).toEqual([])
      })

      it('should throw error when adding multiple variadic arguments', () => {
        const cmd = new Command('test').addArgument('<files...>')

        expect(() => {
          // @ts-expect-error
          cmd.addArgument('<more...>', 'second variadic')
        }).toThrow()
      })
    })

    describe('validation', () => {
      it('should throw error for invalid argument format', () => {
        const cmd = new Command('test')

        expect(() => {
          // @ts-expect-error
          cmd.addArgument('invalid')
        }).toThrow()
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
          name: 'verbose',
          description: 'verbose output',
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
          name: 'format',
          description: 'output format',
          required: true,
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
          name: 'output',
          description: 'output path',
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
          name: 'include',
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
          name: 'exclude',
          description: 'exclude patterns',
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
        }).toThrow()
      })

      it('should throw error for invalid short name', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addOption('-12, --invalid', 'description')
        }).toThrow()
      })

      it('should throw error for duplicate option names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'first')

        expect(() => {
          cmd.addOption('-d, --verbose', 'second')
        }).toThrow()
      })

      it('should throw error for duplicate short names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'first')

        expect(() => {
          cmd.addOption('-v, --debug', 'second')
        }).toThrow()
      })
    })
  })

  describe(Command.prototype.parseArgv.name, () => {
    describe('argument parsing', () => {
      it('should parse required arguments', () => {
        const cmd = new Command('test').addArgument('<input>').addArgument('<output>')

        const result = cmd.parseArgv(['in.txt', 'out.txt'])
        expect(result.args).toEqual(['in.txt', 'out.txt'])
      })

      it('should use defaults for missing optional arguments', () => {
        const cmd = new Command('test')
          .addArgument('<input>')
          .addArgument('[output]', { defaultValue: 'default.txt' })

        const result = cmd.parseArgv(['in.txt'])
        expect(result.args).toEqual(['in.txt', 'default.txt'])
      })

      it('should parse variadic arguments', () => {
        const cmd = new Command('test').addArgument('<files...>')

        const result = cmd.parseArgv(['file1.txt', 'file2.txt', 'file3.txt'])
        expect(result.args).toEqual([['file1.txt', 'file2.txt', 'file3.txt']])
      })

      it('should handle mixed arguments and variadic', () => {
        const cmd = new Command('test').addArgument('<command>').addArgument('<files...>')

        const result = cmd.parseArgv(['build', 'src/index.ts', 'src/utils.ts'])
        expect(result.args).toEqual(['build', ['src/index.ts', 'src/utils.ts']])
      })
    })

    describe('option parsing', () => {
      it('should parse boolean options', () => {
        const cmd = new Command('test')
          .addOption('-v, --verbose', 'verbose output')
          .addOption('-d, --debug', 'debug mode')

        const result = cmd.parseArgv(['-v'])
        expect(result.opts).toEqual({ verbose: true })
      })

      it('should parse string options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['-f', 'json'])
        expect(result.opts).toEqual({ format: 'json' })
      })

      it('should parse long options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['--format', 'xml'])
        expect(result.opts).toEqual({ format: 'xml' })
      })

      it('should handle optional string options with defaults', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path', { defaultValue: 'dist' })

        const result1 = cmd.parseArgv([])
        expect(result1.opts).toEqual({ output: 'dist' })

        const result2 = cmd.parseArgv(['-o', 'build'])
        expect(result2.opts).toEqual({ output: 'build' })
      })
    })

    describe('combined parsing', () => {
      it('should parse arguments and options together', () => {
        const cmd = new Command('test')
          .addArgument('<input>')
          .addArgument('[output]', { defaultValue: 'out.txt' })
          .addOption('-v, --verbose', 'verbose output')
          .addOption('-f, --format <type>', 'output format')

        const result = cmd.parseArgv(['in.txt', '-v', '-f', 'json'])
        expect(result.args).toEqual(['in.txt', 'out.txt'])
        expect(result.opts).toEqual({ verbose: true, format: 'json' })
      })

      it('should handle complex command with all types', () => {
        const cmd = new Command('test')
          .addArgument('<command>')
          .addArgument('[target]', { defaultValue: 'src' })
          .addArgument('[files...]')
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

        expect(result.args).toEqual(['build', 'dist', ['extra1.js', 'extra2.js']])
        expect(result.opts).toEqual({
          verbose: true,
          output: 'build',
          exclude: ['test', 'docs'],
        })
      })
    })

    describe('edge cases', () => {
      it('should handle empty argv', () => {
        const cmd = new Command('test')
          .addArgument('[optional]', { defaultValue: 'default' })
          .addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv([])
        expect(result.args).toEqual(['default'])
        expect(result.opts).toEqual({})
      })

      it('should handle no arguments provided', () => {
        const cmd = new Command('test').addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv()
        expect(result.opts).toEqual({})
      })

      it('should handle parsing with undefined argv', () => {
        const cmd = new Command('test')
          .addArgument('[optional]', { defaultValue: 'default' })
          .addOption('-v, --verbose', 'verbose')

        const result = cmd.parseArgv(undefined as any)
        expect(result.args).toEqual(['default'])
        expect(result.opts).toEqual({})
      })

      it('should handle complex default value scenarios', () => {
        const cmd = new Command('test')
          .addArgument('[files...]', { defaultValue: ['default1.txt', 'default2.txt'] })
          .addOption('-e, --exclude [patterns...]', 'exclude patterns', { defaultValue: ['node_modules', 'dist'] })

        const result = cmd.parseArgv([])
        expect(result.args).toEqual([['default1.txt', 'default2.txt']])
        expect(result.opts.exclude).toEqual(['node_modules', 'dist'])
      })

      it('should handle mixed positional and variadic parsing correctly', () => {
        const cmd = new Command('test')
          .addArgument('<command>')
          .addArgument('<target>')
          .addArgument('[additional...]')
          .addOption('-v, --verbose', 'verbose output')

        const result = cmd.parseArgv(['build', 'src/index.ts', 'src/utils.ts', 'src/types.ts', '-v'])
        expect(result.args).toEqual(['build', 'src/index.ts', ['src/utils.ts', 'src/types.ts']])
        expect(result.opts.verbose).toBe(true)
      })

      it('should handle options that expect a value', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', 'output path')

        const result = cmd.parseArgv(['-o', 'dist'])
        expect(result.opts.output).toBe('dist')
      })

      it('should trim trailing undefined args when optional arg has no default', () => {
        const cmd = new Command('test').addArgument('<input>').addArgument('[output]')

        const result = cmd.parseArgv(['in.txt'])
        // trailing undefined from the missing optional arg should be trimmed
        expect(result.args).toEqual(['in.txt'])
      })

      it('should trim multiple trailing undefined args', () => {
        const cmd = new Command('test').addArgument('<input>').addArgument('[opt1]').addArgument('[opt2]')

        const result = cmd.parseArgv(['in.txt'])
        expect(result.args).toEqual(['in.txt'])
      })
    })
  })

  describe('argument ordering enforcement', () => {
    it('should allow correct ordering: required -> optional -> variadic', () => {
      expect(() => {
        new Command('test')
          .addArgument('<required1>')
          .addArgument('<required2>')
          .addArgument('[optional]')
          .addArgument('[variadic...]')
      }).not.toThrow()
    })

    it('should prevent required after optional', () => {
      expect(() => {
        new Command('test')
          .addArgument('[optional]')
          // @ts-expect-error
          .addArgument('<required>')
      }).toThrow()
    })

    it('should prevent multiple variadic arguments', () => {
      expect(() => {
        new Command('test')
          .addArgument('<first...>')
          // @ts-expect-error
          .addArgument('<second...>')
      }).toThrow()
    })
  })

  describe(Command.prototype.command.name, () => {
    it('should create subcommand with proper parent-child relationship', () => {
      const parent = new Command('parent')
      parent.setVersion('1.0.0')
      const child = parent.command('child')

      expect(child.name).toBe('child')
      expect(child.version).toBeUndefined() // Does not inherit parent version
      expect(child.parent).toBe(parent)
      expect(parent.commands).toContain(child)
    })

    it('should use empty description when not provided', () => {
      const parent = new Command('parent')
      const child = parent.command('child')

      expect(child.description).toBe('')
    })

    it('should inherit only specified options with inheritOptions', () => {
      const parent = new Command('parent')
        .addOption('-v, --verbose', 'verbose')
        .addOption('-d, --debug', 'debug')
        .addOption('-q, --quiet', 'quiet')

      const child = parent.command('child', { inheritOptions: ['verbose', 'debug'] })

      const childOptionNames = child.options.map((o) => o.name)
      expect(childOptionNames).toContain('verbose')
      expect(childOptionNames).toContain('debug')
      expect(childOptionNames).not.toContain('quiet')
    })

    it('should inherit all options except specified with inheritOptionsExcept', () => {
      const parent = new Command('parent')
        .addOption('-v, --verbose', 'verbose')
        .addOption('-d, --debug', 'debug')
        .addOption('-q, --quiet', 'quiet')

      const child = parent.command('child', { inheritOptionsExcept: ['debug'] })

      const childOptionNames = child.options.map((o) => o.name)
      expect(childOptionNames).toContain('verbose')
      expect(childOptionNames).not.toContain('debug')
      expect(childOptionNames).toContain('quiet')
    })

    it('should inherit triggers matching inherited options', () => {
      const parent = new Command('parent')
        .addOption('-v, --verbose', 'verbose')
        .addOption('-d, --debug', 'debug')
        .addTrigger('verbose', () => {})

      const child = parent.command('child', { inheritOptions: ['verbose'] })

      const parsed = child.parseArgv(['-v'])
      expect(parsed.triggers).toHaveLength(1)
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
      cmd.addArgument('<input>')
      cmd.addOption('-v, --verbose', 'verbose output')
      const child = cmd.command('child')

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
      expect(cmd.options).toHaveLength(2)
    })
  })

  describe('protected method validation', () => {
    it('should validate option matching correctly', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')
      const option = cmd.options[0]

      // Access the protected method via the public findOption method which uses it
      expect(findOption(cmd, 'v')).toBe(option)
      expect(findOption(cmd, 'verbose')).toBe(option)
      expect(findOption(cmd, 'invalid')).toBeUndefined()
    })
  })

  describe('subcommand parsing', () => {
    it('should parse subcommand when present', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.command('child').addArgument('<input>').addOption('-d, --debug', 'debug flag')

      const result = parent.parseArgv(['child', 'input.txt', '-d'])

      expect(result.cmd).toBe(child)
      expect(result.args).toEqual(['input.txt'])
      expect(result.opts).toEqual({ debug: true })
    })

    it('should pass global options to subcommand', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.command('child').addArgument('<input>')

      const result = parent.parseArgv(['child', 'input.txt', '-v'])

      expect(result.cmd).toBe(child)
      expect(result.args).toEqual(['input.txt'])
      expect(result.opts).toEqual({ verbose: true })
    })

    it('should parse parent command when no subcommand matches', () => {
      const parent = new Command('parent').addArgument('<input>').addOption('-v, --verbose', 'verbose flag')
      parent.command('child')

      const result = parent.parseArgv(['input.txt', '-v'])

      expect(result.cmd).toBe(parent)
      expect(result.args).toEqual(['input.txt'])
      expect(result.opts).toEqual({ verbose: true })
    })
  })

  describe('variadic option parsing', () => {
    it('should parse required variadic options correctly', () => {
      const cmd = new Command('test').addOption('-i, --include <patterns...>', 'include patterns')

      const result = cmd.parseArgv(['-i', 'src', 'lib', 'test'])
      expect(result.opts.include).toEqual(['src', 'lib', 'test'])
    })

    it('should parse optional variadic options correctly', () => {
      const cmd = new Command('test').addOption('-e, --exclude [patterns...]', 'exclude patterns', {
        defaultValue: ['node_modules'],
      })

      const result1 = cmd.parseArgv([])
      expect(result1.opts.exclude).toEqual(['node_modules'])

      const result2 = cmd.parseArgv(['-e', 'test', 'docs'])
      expect(result2.opts.exclude).toEqual(['test', 'docs'])
    })

    it('should handle variadic options mixed with arguments', () => {
      const cmd = new Command('test')
        .addArgument('<command>')
        .addArgument('[files...]')
        .addOption('-i, --include <patterns...>', 'include patterns')

      // Note: When using variadic options, the option consumes the following arguments
      // until another option or end of args. The remaining args go to variadic arguments.
      const result = cmd.parseArgv(['build', '-i', 'src', 'lib'])
      expect(result.args).toEqual(['build', []])
      expect(result.opts.include).toEqual(['src', 'lib'])
    })
  })

  describe(findSubcommand.name, () => {
    it('should find command by name', () => {
      const parent = new Command('parent')
      const child = parent.command('child')

      expect(findSubcommand(parent, 'child')).toBe(child)
    })

    it('should find command by alias', () => {
      const parent = new Command('parent')
      const child = parent.command('child')
      child.setAliases(['c', 'ch'])

      expect(findSubcommand(parent, 'c')).toBe(child)
      expect(findSubcommand(parent, 'ch')).toBe(child)
    })

    it('should return undefined for non-existent command', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(findSubcommand(parent, 'nonexistent')).toBeUndefined()
    })

    it('should return undefined for empty name', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(findSubcommand(parent, '')).toBeUndefined()
    })
  })

  describe(findOption.name, () => {
    it('should find option by long name', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      const option = findOption(cmd, 'verbose')
      expect(option?.name).toBe('verbose')
    })

    it('should find option by short name', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      const option = findOption(cmd, 'v')
      expect(option?.short).toBe('v')
    })

    it('should return undefined for non-existent option', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose flag')

      expect(findOption(cmd, 'nonexistent')).toBeUndefined()
    })
  })

  describe(getCommandAndAncestors.name, () => {
    it('should return command and all ancestors in order', () => {
      const grandparent = new Command('grandparent')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      const ancestors = getCommandAndAncestors(child)
      expect(ancestors).toEqual([child, parent, grandparent])
    })

    it('should return only self for command with no parents', () => {
      const cmd = new Command('test')
      const ancestors = getCommandAndAncestors(cmd)
      expect(ancestors).toEqual([cmd])
    })
  })

  describe(getCommandAncestors.name, () => {
    it('should return only ancestors, excluding self', () => {
      const grandparent = new Command('grandparent')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      const ancestors = getCommandAncestors(child)
      expect(ancestors).toEqual([parent, grandparent])
    })

    it('should return empty array for command with no parents', () => {
      const cmd = new Command('test')
      const ancestors = getCommandAncestors(cmd)
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
      const cmd = new Command('test').addOption('-H, --hidden', 'hidden option', { hidden: true })

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
      const cmd = new Command('test').addArgument('[optional]')

      expect(cmd.arguments[0].defaultValue).toBeUndefined()
    })

    it('should handle undefined default values for optional options', () => {
      const cmd = new Command('test').addOption('-o, --output [path]', 'output path')

      expect(cmd.options[0].defaultValue).toBeUndefined()
    })

    it('should handle complex default values for variadic arguments', () => {
      const cmd = new Command('test').addArgument('[files...]', { defaultValue: ['src/**/*.ts'] })

      expect(cmd.arguments[0].defaultValue).toEqual(['src/**/*.ts'])
    })
  })

  describe('validation error edge cases', () => {
    it('should allow option names that match argument names', () => {
      const cmd = new Command('test').addArgument('<file>')

      expect(() => {
        cmd.addOption('-f, --file', 'file option')
      }).not.toThrow()
    })

    it('should validate short option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-v, --debug', 'debug flag')
      }).toThrow()
    })

    it('should validate long option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', 'verbose flag')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-d, --verbose', 'debug flag')
      }).toThrow()
    })

    it('should validate option short names are alphanumeric', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('---, --invalid', 'invalid short name')
      }).toThrow()
    })

    it('should validate option short names are single characters', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('-ab, --invalid', 'invalid short name')
      }).toThrow()
    })

    it('should validate option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', 'global flag')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-l, --global', 'local flag')
      }).toThrow()
    })

    it('should validate short option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', 'global flag')
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-g, --local', 'local flag')
      }).toThrow()
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

      expect(findSubcommand(parent, '')).toBeUndefined()
    })

    it('should handle null command name in findCommand', () => {
      const parent = new Command('parent')
      parent.command('child')

      expect(findSubcommand(parent, null as any)).toBeUndefined()
    })
  })

  describe(Command.prototype.renderHelp.name, () => {
    it('should render basic help with command info', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')

      const help = cmd.renderHelp()

      expect(help).toContain('myapp')
    })

    it('should strip ANSI colors when noColor is true', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')

      const colorHelp = cmd.renderHelp()
      const plainHelp = cmd.renderHelp({ noColor: true })

      expect(plainHelp).not.toContain('\x1b[')
      expect(plainHelp.length).toBeLessThanOrEqual(colorHelp.length)
    })

    it('should render help with arguments and options', () => {
      const cmd = new Command('myapp')
      cmd.setVersion('1.0.0')
      cmd
        .addArgument('<input>')
        .addArgument('[output]', { defaultValue: 'out.txt' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format')

      const help = cmd.renderHelp()

      expect(help).toContain('<input>')
      expect(help).toContain('[output]')
      expect(help).toContain('-v, --verbose')
      expect(help).toContain('-f, --format')
    })

    it('should render help with subcommands', () => {
      const parent = new Command('myapp')
      parent.setVersion('1.0.0')
      parent.command('build')
      parent.command('test')

      const help = parent.renderHelp()

      expect(help).toContain('build')
      expect(help).toContain('test')
    })

    it('should render help with variadic arguments and options', () => {
      const cmd = new Command('myapp')
      cmd
        .addArgument('<files...>')
        .addOption('-i, --include <patterns...>', 'include patterns')
        .addOption('-e, --exclude [patterns...]', 'exclude patterns')

      const help = cmd.renderHelp()

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
        .addArgument('<command>')
        .addArgument('[target]', { defaultValue: 'src' })
        .addOption('-v, --verbose', 'verbose output')
        .addOption('-f, --format <type>', 'output format', { choices: ['json', 'xml'] })
        .addOption('-o, --output [path]', 'output path', { defaultValue: 'dist' })

      const build = cmd.command('build')
      build.setSummary('Build the project')
      build.addArgument('<source>')

      const help = cmd.renderHelp()

      expect(help).toContain('myapp')
      expect(help).toContain('This is a test application') // The summary might not be in the help if description is present
      expect(help).toContain('build')
    })
  })

  describe(Command.prototype.castArguments.name, () => {
    it('should return the arguments array cast to the command type', () => {
      const cmd = new Command('test').addArgument('<name>')
      const result = cmd.castArguments(['hello'])
      expect(result).toEqual(['hello'])
    })

    it('should pass through an empty array', () => {
      const cmd = new Command('test')
      const result = cmd.castArguments([])
      expect(result).toEqual([])
    })
  })

  describe('addTrigger', () => {
    it('should use default predicate when none provided', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose').addTrigger('verbose', () => {})

      const parsed = cmd.parseArgv(['-v'])
      expect(parsed.triggers).toHaveLength(1)
    })

    it('should select trigger action over main action', () => {
      let triggerCalled = false
      const cmd = new Command('test')
        .addOption('-v, --verbose', 'verbose')
        .setAction(() => {})
        .addTrigger('verbose', () => {
          triggerCalled = true
        })

      const parsed = cmd.parseArgv(['-v'])
      expect(parsed.action).toBe('verbose')
      void parsed.execute!()
      expect(triggerCalled).toBe(true)
    })

    it('should execute main action when no trigger matches', () => {
      let mainCalled = false
      const cmd = new Command('test')
        .addOption('-v, --verbose', 'verbose')
        .setAction(() => {
          mainCalled = true
        })
        .addTrigger('verbose', () => {})

      const parsed = cmd.parseArgv([])
      expect(parsed.action).toBe('main')
      void parsed.execute!()
      expect(mainCalled).toBe(true)
    })

    it('should have no execute when no action or trigger', () => {
      const cmd = new Command('test')
      const parsed = cmd.parseArgv([])
      expect(parsed.execute).toBeUndefined()
    })
  })

  describe('option long-name camelCase mapping', () => {
    it('should map multi-word long option names to camelCase', () => {
      const cmd = new Command('test').addOption('-o, --output-dir <path>', 'output directory')

      const result = cmd.parseArgv(['--output-dir', '/tmp'])
      expect(result.opts.outputDir).toBe('/tmp')
    })

    it('should handle --no- negation with long option names', () => {
      const cmd = new Command('test').addOption('-c, --use-color', 'use color')

      const result = cmd.parseArgv(['--no-use-color'])
      expect(result.opts.useColor).not.toBe(true)
    })
  })

  describe(Command.prototype.castOptions.name, () => {
    it('should return the options object cast to the command type', () => {
      const cmd = new Command('test').addOption('-v, --verbose', 'verbose')
      const result = cmd.castOptions({ verbose: true })
      expect(result).toEqual({ verbose: true })
    })

    it('should pass through an empty object', () => {
      const cmd = new Command('test')
      const result = cmd.castOptions({})
      expect(result).toEqual({})
    })
  })

  describe(Command.prototype.setAction.name, () => {
    it('should set the action and return this for chaining', () => {
      const cmd = new Command('test')
      const handler = () => {}
      const result = cmd.setAction(handler)
      expect(result).toBe(cmd)
    })

    it('should set an action that can be invoked via parseArgv', () => {
      const cmd = new Command('test').addArgument('<name>').setAction(({ args }) => {
        void args[0]
      })
      const parsed = cmd.parseArgv(['hello'])
      expect(parsed.action).toBe('main')
    })
  })

  describe(Command.prototype.helpConfiguration.name, () => {
    it('should invoke the callback with the Help instance', () => {
      const cmd = new Command('test')
      let helpInstance: unknown = null
      cmd.helpConfiguration((help) => {
        helpInstance = help
      })
      expect(helpInstance).toBe(cmd.help)
    })

    it('should return this for chaining', () => {
      const cmd = new Command('test')
      const result = cmd.helpConfiguration(() => {})
      expect(result).toBe(cmd)
    })
  })

  describe('addHelpOption', () => {
    it('should add a help option to a command', () => {
      const cmd = new Command('test').helpConfiguration()
      expect(cmd.options.some((o) => o.long === 'help')).toBe(true)
      expect(cmd.options.some((o) => o.short === 'h')).toBe(true)
    })

    it('should add --help option with correct description', () => {
      const cmd = new Command('test').helpConfiguration()
      const helpOpt = cmd.options.find((o) => o.long === 'help')
      expect(helpOpt).toBeDefined()
      expect(helpOpt!.description).toBe('Display help information')
    })

    it('should execute help trigger action', () => {
      const cmd = new Command('test').helpConfiguration().addOption('-v, --verbose', 'verbose')
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const parsed = cmd.parseArgv(['--help'])
      void parsed.execute!()
      expect(spy).toHaveBeenCalledWith(expect.any(String))
      spy.mockRestore()
    })

    it('should execute addHelpOption trigger action on subcommand', () => {
      const parent = new Command('root')
      const cmd = new Command('test2', parent).helpConfiguration()
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const parsed = cmd.parseArgv(['--help'])
      void parsed.execute!()
      expect(spy).toHaveBeenCalledWith(expect.any(String))
      spy.mockRestore()
    })
  })

  describe('addVersionOption', () => {
    class TestCommand extends Command {
      public exposeAddVersionOption() {
        return this.addVersionOption()
      }
    }

    it('should add a version option', () => {
      const cmd = new TestCommand('test')
      cmd.exposeAddVersionOption()
      expect(cmd.options.some((o) => o.long === 'version')).toBe(true)
      expect(cmd.options.some((o) => o.short === 'V')).toBe(true)
    })

    it('should execute version trigger action', () => {
      const cmd = new TestCommand('test')
      cmd.version = '1.2.3'
      cmd.exposeAddVersionOption()
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const parsed = cmd.parseArgv(['--version'])
      void parsed.execute!()
      expect(spy).toHaveBeenCalledWith('1.2.3')
      spy.mockRestore()
    })
  })

  describe('option value sorting in parseArgv', () => {
    it('should sort options: defined values -> true -> false -> undefined', () => {
      const cmd = new Command('test')
        .addOption('-a, --aaa <val>', 'string opt 1')
        .addOption('-b, --bbb <val>', 'string opt 2')
        .addOption('-c, --ccc <val>', 'string opt 3')
        .addOption('-d, --ddd', 'bool opt 1')
        .addOption('-e, --eee', 'bool opt 2')
        .addOption('-f, --fff', 'bool opt 3')
        .addOption('-g, --ggg', 'bool opt 4')
        .addOption('-i, --iii', 'bool opt 5')
        .addOption('-j, --jjj', 'bool opt 6')

      // aaa,bbb,ccc = defined strings; ddd,eee = true; fff = false (negated); ggg,iii,jjj = undefined (not passed)
      const result = cmd.parseArgv(['-a', 'x', '-b', 'y', '-c', 'z', '-d', '-e', '--no-fff'])
      const keys = Object.keys(result.opts)

      const aIdx = keys.indexOf('aaa')
      const bIdx = keys.indexOf('bbb')
      const cIdx = keys.indexOf('ccc')
      const dIdx = keys.indexOf('ddd')
      const eIdx = keys.indexOf('eee')
      const fIdx = keys.indexOf('fff')
      const gIdx = keys.indexOf('ggg')

      expect(aIdx).toBeLessThan(dIdx)
      expect(bIdx).toBeLessThan(dIdx)
      expect(cIdx).toBeLessThan(dIdx)
      expect(dIdx).toBeLessThan(fIdx) // true before false
      expect(eIdx).toBeLessThan(fIdx) // true before false
      expect(fIdx).toBeLessThan(gIdx) // false before undefined
    })

    it('should correctly sort two-element comparisons: defined vs undefined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa <val>', 'string opt').addOption('-b, --bbb', 'bool opt')
      const result = sub.parseArgv(['-a', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: true vs false', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa', 'bool opt 1').addOption('-b, --bbb', 'bool opt 2')
      const result = sub.parseArgv(['-a', '--no-bbb'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: false vs true', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa', 'bool opt 1').addOption('-b, --bbb', 'bool opt 2')
      const result = sub.parseArgv(['--no-aaa', '-b'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('bbb')).toBeLessThan(keys.indexOf('aaa'))
    })

    it('should correctly sort two-element comparisons: undefined vs defined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa', 'bool opt').addOption('-b, --bbb <val>', 'string opt')
      const result = sub.parseArgv(['-b', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('bbb')).toBeLessThan(keys.indexOf('aaa'))
    })

    it('should correctly sort two-element comparisons: true vs defined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa', 'bool opt').addOption('-b, --bbb <val>', 'string opt')
      const result = sub.parseArgv(['-a', '-b', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('bbb')).toBeLessThan(keys.indexOf('aaa'))
    })

    it('should correctly sort two-element comparisons: defined vs true', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa <val>', 'string opt').addOption('-b, --bbb', 'bool opt')
      const result = sub.parseArgv(['-a', 'x', '-b'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: false vs undefined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa', 'bool opt 1').addOption('-b, --bbb', 'bool opt 2')
      const result = sub.parseArgv(['--no-aaa'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: defined vs false', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa <val>', 'string opt').addOption('-b, --bbb', 'bool opt')
      const result = sub.parseArgv(['-a', 'x', '--no-bbb'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two equal defined values to 0', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub.addOption('-a, --aaa <val>', 'string opt 1').addOption('-b, --bbb <val>', 'string opt 2')
      const result = sub.parseArgv(['-a', 'x', '-b', 'y'])
      // Both defined, order is stable (original order preserved)
      expect(Object.keys(result.opts)).toContain('aaa')
      expect(Object.keys(result.opts)).toContain('bbb')
    })
  })
})
