import { afterEach } from "vitest";
import { beforeEach } from "vitest";
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { vi } from "vitest";
import { Command } from './Command'

describe(Command.name, () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
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
          .addOption('-v, --verbose', { description: 'verbose output' })
          .addOption('-w, --wow', { description: 'wow mode' })

        const result = cmd.parseArgv(['-v'])
        expect(result.opts).toEqual({ verbose: true })
      })

      it('should parse string options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', { description: 'output format' })

        const result = cmd.parseArgv(['-f', 'json'])
        expect(result.opts).toEqual({ format: 'json' })
      })

      it('should parse long options', () => {
        const cmd = new Command('test').addOption('-f, --format <type>', { description: 'output format' })

        const result = cmd.parseArgv(['--format', 'xml'])
        expect(result.opts).toEqual({ format: 'xml' })
      })

      it('should handle optional string options with defaults', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', {
          description: 'output path',
          defaultValue: 'dist',
        })

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
          .addOption('-v, --verbose', { description: 'verbose output' })
          .addOption('-f, --format <type>', { description: 'output format' })

        const result = cmd.parseArgv(['in.txt', '-v', '-f', 'json'])
        expect(result.args).toEqual(['in.txt', 'out.txt'])
        expect(result.opts).toEqual({ verbose: true, format: 'json' })
      })

      it('should handle complex command with all types', () => {
        const cmd = new Command('test')
          .addArgument('<command>')
          .addArgument('[target]', { defaultValue: 'src' })
          .addArgument('[files...]')
          .addOption('-v, --verbose', { description: 'verbose output' })
          .addOption('-o, --output <dir>', { description: 'output directory' })
          .addOption('-e, --exclude [patterns...]', {
            description: 'exclude patterns',
            defaultValue: ['node_modules'],
          })

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
          .addOption('-v, --verbose', { description: 'verbose' })

        const result = cmd.parseArgv([])
        expect(result.args).toEqual(['default'])
        expect(result.opts).toEqual({})
      })

      it('should handle no arguments provided', () => {
        const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose' })

        const result = cmd.parseArgv()
        expect(result.opts).toEqual({})
      })

      it('should handle parsing with undefined argv', () => {
        const cmd = new Command('test')
          .addArgument('[optional]', { defaultValue: 'default' })
          .addOption('-v, --verbose', { description: 'verbose' })

        const result = cmd.parseArgv(undefined as any)
        expect(result.args).toEqual(['default'])
        expect(result.opts).toEqual({})
      })

      it('should handle complex default value scenarios', () => {
        const cmd = new Command('test')
          .addArgument('[files...]', { defaultValue: ['default1.txt', 'default2.txt'] })
          .addOption('-e, --exclude [patterns...]', {
            description: 'exclude patterns',
            defaultValue: ['node_modules', 'dist'],
          })

        const result = cmd.parseArgv([])
        expect(result.args).toEqual([['default1.txt', 'default2.txt']])
        expect(result.opts.exclude).toEqual(['node_modules', 'dist'])
      })

      it('should handle mixed positional and variadic parsing correctly', () => {
        const cmd = new Command('test')
          .addArgument('<command>')
          .addArgument('<target>')
          .addArgument('[additional...]')
          .addOption('-v, --verbose', { description: 'verbose output' })

        const result = cmd.parseArgv(['build', 'src/index.ts', 'src/utils.ts', 'src/types.ts', '-v'])
        expect(result.args).toEqual(['build', 'src/index.ts', ['src/utils.ts', 'src/types.ts']])
        expect(result.opts.verbose).toBe(true)
      })

      it('should handle options that expect a value', () => {
        const cmd = new Command('test').addOption('-o, --output [path]', { description: 'output path' })

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

  describe('subcommand parsing', () => {
    it('should parse subcommand when present', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose flag' })
      const child = parent
        .command('child')
        .addArgument('<input>')
        .addOption('-w, --wow', { description: 'wow flag' })

      const result = parent.parseArgv(['child', 'input.txt', '-w'])

      expect(result.cmd).toBe(child)
      expect(result.args).toEqual(['input.txt'])
      expect(result.opts).toEqual({ wow: true })
    })

    it('should pass global options to subcommand', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose flag' })
      const child = parent.command('child').addArgument('<input>')

      const result = parent.parseArgv(['child', 'input.txt', '-v'])

      expect(result.cmd).toBe(child)
      expect(result.args).toEqual(['input.txt'])
      expect(result.opts).toEqual({ verbose: true })
    })

    it('should parse parent command when no subcommand matches', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose flag' })
      parent.command('child')

      const result = parent.parseArgv(['-v'])

      expect(result.cmd).toBe(parent)
      expect(result.args).toEqual([])
      expect(result.opts).toEqual({ verbose: true })
    })
  })

  describe('variadic option parsing', () => {
    it('should parse required variadic options correctly', () => {
      const cmd = new Command('test').addOption('-i, --include <patterns...>', { description: 'include patterns' })

      const result = cmd.parseArgv(['-i', 'src', 'lib', 'test'])
      expect(result.opts.include).toEqual(['src', 'lib', 'test'])
    })

    it('should parse optional variadic options correctly', () => {
      const cmd = new Command('test').addOption('-e, --exclude [patterns...]', {
        description: 'exclude patterns',
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
        .addOption('-i, --include <patterns...>', { description: 'include patterns' })

      // Note: When using variadic options, the option consumes the following arguments
      // until another option or end of args. The remaining args go to variadic arguments.
      const result = cmd.parseArgv(['build', '-i', 'src', 'lib'])
      expect(result.args).toEqual(['build', []])
      expect(result.opts.include).toEqual(['src', 'lib'])
    })
  })

  describe('option long-name camelCase mapping', () => {
    it('should map multi-word long option names to camelCase', () => {
      const cmd = new Command('test').addOption('-o, --output-dir <path>', { description: 'output directory' })

      const result = cmd.parseArgv(['--output-dir', '/tmp'])
      expect(result.opts.outputDir).toBe('/tmp')
    })

    it('should handle --no- negation with long option names', () => {
      const cmd = new Command('test').addOption('-c, --use-color', { description: 'use color' })

      const result = cmd.parseArgv(['--no-use-color'])
      expect(result.opts.useColor).not.toBe(true)
    })
  })

  describe('option value sorting in parseArgv', () => {
    it('should sort options: defined values -> true -> false -> undefined', () => {
      const cmd = new Command('test')
        .addOption('-a, --aaa <val>', { description: 'string opt 1' })
        .addOption('-b, --bbb <val>', { description: 'string opt 2' })
        .addOption('-c, --ccc <val>', { description: 'string opt 3' })
        .addOption('-d, --ddd', { description: 'bool opt 1' })
        .addOption('-e, --eee', { description: 'bool opt 2' })
        .addOption('-f, --fff', { description: 'bool opt 3' })
        .addOption('-g, --ggg', { description: 'bool opt 4' })
        .addOption('-i, --iii', { description: 'bool opt 5' })
        .addOption('-j, --jjj', { description: 'bool opt 6' })

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
      // undefined options are filtered out of opts
      expect(keys).not.toContain('ggg')
      expect(keys).not.toContain('iii')
      expect(keys).not.toContain('jjj')
    })

    it('should correctly sort two-element comparisons: defined vs undefined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa <val>', { description: 'string opt' })
        .addOption('-b, --bbb', { description: 'bool opt' })
      const result = sub.parseArgv(['-a', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys).toContain('aaa')
      expect(keys).not.toContain('bbb')
    })

    it('should correctly sort two-element comparisons: true vs false', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt 1' })
        .addOption('-b, --bbb', { description: 'bool opt 2' })
      const result = sub.parseArgv(['-a', '--no-bbb'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: false vs true', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt 1' })
        .addOption('-b, --bbb', { description: 'bool opt 2' })
      const result = sub.parseArgv(['--no-aaa', '-b'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('bbb')).toBeLessThan(keys.indexOf('aaa'))
    })

    it('should correctly sort two-element comparisons: undefined vs defined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt' })
        .addOption('-b, --bbb <val>', { description: 'string opt' })
      const result = sub.parseArgv(['-b', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys).toContain('bbb')
      expect(keys).not.toContain('aaa')
    })

    it('should correctly sort two-element comparisons: true vs defined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt' })
        .addOption('-b, --bbb <val>', { description: 'string opt' })
      const result = sub.parseArgv(['-a', '-b', 'x'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('bbb')).toBeLessThan(keys.indexOf('aaa'))
    })

    it('should correctly sort two-element comparisons: defined vs true', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa <val>', { description: 'string opt' })
        .addOption('-b, --bbb', { description: 'bool opt' })
      const result = sub.parseArgv(['-a', 'x', '-b'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two-element comparisons: false vs undefined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt 1' })
        .addOption('-b, --bbb', { description: 'bool opt 2' })
      const result = sub.parseArgv(['--no-aaa'])
      const keys = Object.keys(result.opts)
      expect(keys).toContain('aaa')
      expect(keys).not.toContain('bbb')
    })

    it('should correctly sort two-element comparisons: defined vs false', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa <val>', { description: 'string opt' })
        .addOption('-b, --bbb', { description: 'bool opt' })
      const result = sub.parseArgv(['-a', 'x', '--no-bbb'])
      const keys = Object.keys(result.opts)
      expect(keys.indexOf('aaa')).toBeLessThan(keys.indexOf('bbb'))
    })

    it('should correctly sort two equal defined values to 0', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa <val>', { description: 'string opt 1' })
        .addOption('-b, --bbb <val>', { description: 'string opt 2' })
      const result = sub.parseArgv(['-a', 'x', '-b', 'y'])
      // Both defined, order is stable (original order preserved)
      expect(Object.keys(result.opts)).toContain('aaa')
      expect(Object.keys(result.opts)).toContain('bbb')
    })

    it('should correctly sort two-element comparisons: false vs false', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt 1' })
        .addOption('-b, --bbb', { description: 'bool opt 2' })
      const result = sub.parseArgv(['--no-aaa', '--no-bbb'])
      const keys = Object.keys(result.opts)
      // Both false, order is stable (original order preserved)
      expect(keys).toContain('aaa')
      expect(keys).toContain('bbb')
    })

    it('should correctly sort two-element comparisons: true vs undefined', () => {
      const parent = new Command('root')
      const sub = parent.command('sub')
      sub
        .addOption('-a, --aaa', { description: 'bool opt 1' })
        .addOption('-b, --bbb', { description: 'bool opt 2' })
      const result = sub.parseArgv(['-a'])
      const keys = Object.keys(result.opts)
      expect(keys).toContain('aaa')
      expect(keys).not.toContain('bbb')
    })
  })

  describe('parseArgv validation', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should report error for missing required argument', () => {
      const cmd = new Command('test').addArgument('<input>')
      const result = cmd.parseArgv([])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Missing argument'))).toBe(true)
    })

    it('should report error for missing required variadic argument', () => {
      const cmd = new Command('test').addArgument('<files...>')
      const result = cmd.parseArgv([])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Missing argument'))).toBe(true)
    })

    it('should report error for invalid argument choices', () => {
      const cmd = new Command('test').addArgument('<mode>', {
        description: 'mode',
        choices: ['dev', 'prod'],
      })
      const result = cmd.parseArgv(['staging'])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Invalid argument'))).toBe(true)
    })

    it('should not report error when required option flag is not used at all', () => {
      const cmd = new Command('test').addOption('-f, --file <path>', { description: 'file' })
      const result = cmd.parseArgv([])
      expect(result.errors).toBeUndefined()
    })

    it('should report error for invalid option choices', () => {
      const cmd = new Command('test').addOption('-f, --format <type>', {
        description: 'format',
        choices: ['json', 'xml'],
      })
      const result = cmd.parseArgv(['-f', 'csv'])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Invalid option value'))).toBe(true)
    })

    it('should not report errors when all validations pass', () => {
      const cmd = new Command('test')
        .addArgument('<mode>', { description: 'mode', choices: ['dev', 'prod'] })
        .addOption('-f, --format <type>', { description: 'format', choices: ['json', 'xml'] })
      const result = cmd.parseArgv(['dev', '-f', 'json'])
      expect(result.errors).toBeUndefined()
    })

    it('should report error for invalid variadic option choices', () => {
      const cmd = new Command('test').addOption('-t, --tags <vals...>', {
        description: 'tags',
        choices: ['a', 'b', 'c'],
      })
      const result = cmd.parseArgv(['-t', 'a', 'x'])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Invalid option value'))).toBe(true)
    })

    it('should report error for unknown option', () => {
      const cmd = new Command('test')
      const result = cmd.parseArgv(['--unknown-flag'])
      expect(result.errors).toBeDefined()
      expect(result.errors!.some((e) => e.includes('Unknown option'))).toBe(true)
    })
  })
})
