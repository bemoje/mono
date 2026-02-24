import { describe } from "vitest";
import { expect } from "vitest";
import { expectTypeOf } from "vitest";
import { it } from "vitest";
import type { Arguments } from "./types";
import type { Options } from "./types";
import { Command } from './Command'

// Helper to extract the A (Arguments) generic from a Command
type CmdArgs<C> = C extends Command<infer A, Options> ? A : never
// Helper to extract the O (Options) generic from a Command
type CmdOpts<C> = C extends Command<Arguments, infer O> ? O : never

// Compile-time assertion helper
type AssertExtends<T extends Expected, Expected> = T

describe(Command.name + ' type inference', () => {
  describe('addArgument', () => {
    it('should infer required argument as [string]', () => {
      const cmd = new Command('test').addArgument('<input>')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string]>
      expectTypeOf(cmd).toEqualTypeOf<Command<[string], { help?: boolean; debug?: boolean }>>()
    })

    it('should infer optional argument as [string | undefined]', () => {
      const cmd = new Command('test').addArgument('[output]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string | undefined]>
      expectTypeOf(cmd).toEqualTypeOf<Command<[string | undefined], { help?: boolean; debug?: boolean }>>()
    })

    it('should infer optional argument with defaultValue as [string]', () => {
      const cmd = new Command('test').addArgument('[output]', { defaultValue: 'out.txt' })
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string]>
    })

    it('should infer required variadic argument as [string[]]', () => {
      const cmd = new Command('test').addArgument('<files...>')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string[]]>
    })

    it('should infer optional variadic argument as [string[]]', () => {
      const cmd = new Command('test').addArgument('[files...]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string[]]>
    })

    it('should accumulate multiple arguments in order', () => {
      const cmd = new Command('test').addArgument('<input>').addArgument('[output]', { defaultValue: 'out.txt' })
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string]>
    })

    it('should accumulate required then optional', () => {
      const cmd = new Command('test').addArgument('<input>').addArgument('[output]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string | undefined]>
    })
  })

  describe('addArgument chaining constraints', () => {
    it('should prevent required argument after optional', () => {
      const cmd = new Command('test').addArgument('[opt]')
      expect(() => {
        // @ts-expect-error - required arg not allowed after optional
        cmd.addArgument('<req>')
      }).toThrow()
    })

    it('should prevent required variadic after optional', () => {
      const cmd = new Command('test').addArgument('[opt]')
      expect(() => {
        // @ts-expect-error - required variadic not allowed after optional
        cmd.addArgument('<files...>')
      }).toThrow()
    })

    it('should prevent any argument after required variadic', () => {
      const cmd = new Command('test').addArgument('<files...>')
      expect(() => {
        // @ts-expect-error - no args allowed after variadic
        cmd.addArgument('<more>')
      }).toThrow()
    })

    it('should prevent optional argument after required variadic', () => {
      const cmd = new Command('test').addArgument('<files...>')
      expect(() => {
        // @ts-expect-error - no args allowed after variadic
        cmd.addArgument('[more]')
      }).toThrow()
    })

    it('should prevent any argument after optional variadic', () => {
      const cmd = new Command('test').addArgument('[files...]')
      expect(() => {
        // @ts-expect-error - no args allowed after variadic
        cmd.addArgument('[more]')
      }).toThrow()
    })

    it('should allow optional after required', () => {
      const cmd = new Command('test').addArgument('<req>').addArgument('[opt]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string | undefined]>
    })

    it('should allow optional variadic after required', () => {
      const cmd = new Command('test').addArgument('<req>').addArgument('[files...]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string[]]>
    })

    it('should allow required variadic after required', () => {
      const cmd = new Command('test').addArgument('<req>').addArgument('<files...>')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string[]]>
    })

    it('should allow optional variadic after optional', () => {
      const cmd = new Command('test').addArgument('[opt]').addArgument('[files...]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string | undefined, string[]]>
    })

    it('should infer long chain of mixed argument types', () => {
      const cmd = new Command('test')
        .addArgument('<req1>')
        .addArgument('<req2>')
        .addArgument('[opt]')
        .addArgument('[files...]')
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string, string | undefined, string[]]>
    })
  })

  describe('addOption', () => {
    it('should infer boolean flag as optional boolean', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { verbose?: boolean }>
    })

    it('should infer boolean flag with default as required boolean', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose', defaultValue: false })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { verbose: boolean }>
    })

    it('should infer required string option', () => {
      const cmd = new Command('test').addOption('-f, --file <path>', { description: 'file' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { file: string }>
    })

    it('should infer optional string option', () => {
      const cmd = new Command('test').addOption('-o, --output [path]', { description: 'output' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { output?: string }>
    })

    it('should infer optional string option with default as required string', () => {
      const cmd = new Command('test').addOption('-o, --output [path]', {
        description: 'output',
        defaultValue: 'dist',
      })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { output: string }>
    })

    it('should infer required variadic option as string[]', () => {
      const cmd = new Command('test').addOption('-i, --include <patterns...>', { description: 'include' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { include: string[] }>
    })

    it('should infer optional variadic option as string[]', () => {
      const cmd = new Command('test').addOption('-e, --exclude [patterns...]', { description: 'exclude' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { exclude: string[] }>
    })

    it('should camelCase hyphenated long names', () => {
      const cmd = new Command('test').addOption('-n, --no-color', { description: 'disable color' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { noColor?: boolean }>
    })

    it('should camelCase multi-hyphenated long names', () => {
      const cmd = new Command('test').addOption('-s, --some-long-name <val>', { description: 'test' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { someLongName: string }>
    })

    it('should camelCase triple-hyphenated boolean option', () => {
      const cmd = new Command('test').addOption('-x, --my-very-long-option', { description: 'test' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { myVeryLongOption?: boolean }>
    })

    it('should accumulate multiple option types', () => {
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOption('-f, --file <path>', { description: 'file' })
        .addOption('-o, --output [path]', { description: 'output', defaultValue: 'dist' })
      type _O = AssertExtends<CmdOpts<typeof cmd>, { verbose?: boolean; file: string; output: string }>
    })
  })

  describe('parseArgv result types', () => {
    it('should preserve option types in parsed result opts', () => {
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOption('-f, --file <path>', { description: 'file' })
      const result = cmd.parseArgv([])
      expectTypeOf(result.opts).toHaveProperty('verbose')
      expectTypeOf(result.opts).toHaveProperty('file')
      expectTypeOf(result.opts.file).toBeString()
    })

    it('should type cmd in result as Command with narrow generics', () => {
      const cmd = new Command('test').addArgument('<input>').addOption('-v, --verbose', { description: 'verbose' })
      const result = cmd.parseArgv([])
      type ResultCmd = typeof result.cmd
      // @ts-expect-error
      type _A = AssertExtends<CmdArgs<ResultCmd>, [string]>
      type _O = AssertExtends<CmdOpts<ResultCmd>, { verbose?: boolean }>
    })

    it('should type execute as returning Promise<void>', () => {
      const cmd = new Command('test').setAction(() => {})
      const result = cmd.parseArgv([])
      expectTypeOf(result.execute).toEqualTypeOf<() => Promise<void>>()
    })

    it('should type errors as string array or undefined', () => {
      const result = new Command('test').parseArgv([])
      expectTypeOf(result.errors).toEqualTypeOf<string[] | undefined>()
    })

    it('should type path and argv as string arrays', () => {
      const result = new Command('test').parseArgv([])
      expectTypeOf(result.path).toEqualTypeOf<string[]>()
      expectTypeOf(result.argv).toEqualTypeOf<string[]>()
      expectTypeOf(result.name).toBeString()
    })
  })

  describe('combined arguments and options', () => {
    it('should infer both args and opts together', () => {
      const cmd = new Command('test')
        .addArgument('<input>')
        .addArgument('[output]')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOption('-f, --format <type>', { description: 'format' })
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string | undefined]>
      type _O = AssertExtends<CmdOpts<typeof cmd>, { verbose?: boolean; format: string }>
    })

    it('should infer complex command with all option and argument types', () => {
      const cmd = new Command('test')
        .addArgument('<command>')
        .addArgument('[target]', { defaultValue: 'src' })
        .addArgument('[files...]')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOption('-o, --output <dir>', { description: 'output' })
        .addOption('-e, --exclude [patterns...]', { description: 'exclude' })
        .addOption('-d, --dry-run', { description: 'dry run', defaultValue: false })
      type _A = AssertExtends<CmdArgs<typeof cmd>, [string, string, string[]]>
      type _O = AssertExtends<
        CmdOpts<typeof cmd>,
        { verbose?: boolean; output: string; exclude: string[]; dryRun: boolean }
      >
    })
  })

  describe('setVersion and helpConfiguration', () => {
    it('should include help option type', () => {
      const cmd = new Command('test').helpConfiguration()
      type _O = AssertExtends<CmdOpts<typeof cmd>, { help?: boolean; debug?: boolean }>
    })

    it('should include version option type', () => {
      const cmd = new Command('test').setVersion('1.0.0')
      type _O = AssertExtends<CmdOpts<typeof cmd>, { version?: boolean }>
    })

    it('should include both help and version option types', () => {
      const cmd = new Command('test').setVersion('1.0.0').helpConfiguration()
      type _O = AssertExtends<CmdOpts<typeof cmd>, { help?: boolean; version?: boolean }>
    })
  })

  describe('command (subcommands)', () => {
    it('should inherit all parent options by default', () => {
      const parent = new Command('parent')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOption('-w, --wow', { description: 'wow' })
      const sub = parent.command('sub')
      type _O = AssertExtends<CmdOpts<typeof sub>, { verbose?: boolean; wow?: boolean }>
    })

    it('should reset arguments for subcommand', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose' })
      const sub = parent.command('sub')
      type _A = AssertExtends<CmdArgs<typeof sub>, []>
    })

    it('should allow subcommand to add its own arguments', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose' })
      const sub = parent.command('sub').addArgument('<file>')
      type _A = AssertExtends<CmdArgs<typeof sub>, [string]>
      type _O = AssertExtends<CmdOpts<typeof sub>, { verbose?: boolean }>
    })

    it('should allow subcommand to add its own options while keeping parent options', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose' })
      const sub = parent.command('sub').addOption('-f, --file <path>', { description: 'file' })
      type _O = AssertExtends<CmdOpts<typeof sub>, { verbose?: boolean; file: string }>
    })

    it('should allow deep subcommand chain inheriting all ancestor options', () => {
      const root = new Command('root').addOption('-v, --verbose', { description: 'verbose' })
      const mid = root.command('mid').addOption('-f, --file <path>', { description: 'file' })
      const leaf = mid.command('leaf').addOption('-o, --output [dir]', { description: 'output' })
      type _O = AssertExtends<CmdOpts<typeof leaf>, { verbose?: boolean; file: string; output?: string }>
    })
  })

  describe('addCommand return type', () => {
    it('should return parent command type preserving opts', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose' })
      const result = parent.addCommand('child', (cmd) => cmd)
      type _O = AssertExtends<CmdOpts<typeof result>, { verbose?: boolean }>
      type _A = AssertExtends<CmdArgs<typeof result>, []>
    })
  })

  describe('setAction handler inference', () => {
    it('should type handler args matching command args tuple', () => {
      new Command('test')
        .addArgument('<input>')
        .addOption('-v, --verbose', { description: 'verbose' })
        .setAction((input, opts, _meta) => {
          expectTypeOf(input).toBeString()
          expectTypeOf(opts.verbose).toEqualTypeOf<boolean | undefined>()
        })
    })

    it('should type handler with multiple args and options', () => {
      new Command('test')
        .addArgument('<input>')
        .addArgument('[output]')
        .addOption('-f, --file <path>', { description: 'file' })
        .setAction((input, output, opts, _meta) => {
          expectTypeOf(input).toBeString()
          expectTypeOf(output).toEqualTypeOf<string | undefined>()
          expectTypeOf(opts.file).toBeString()
        })
    })

    it('should type handler with variadic argument', () => {
      new Command('test').addArgument('<files...>').setAction((files, _opts, _meta) => {
        expectTypeOf(files).toEqualTypeOf<string[]>()
      })
    })

    it('should type metadata with correct properties', () => {
      new Command('test')
        .addArgument('<input>')
        .addOption('-v, --verbose', { description: 'verbose' })
        .setAction((_input, _opts, meta) => {
          expectTypeOf(meta.args).toEqualTypeOf<[string]>()
          expectTypeOf(meta.name).toBeString()
          expectTypeOf(meta.argv).toEqualTypeOf<string[]>()
          expectTypeOf(meta.path).toEqualTypeOf<string[]>()
        })
    })
  })

  describe('addOptionHook type constraint', () => {
    it('should accept valid option names', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose' })
      cmd.addOptionHook('verbose', () => {})
      cmd.addOptionHook('help', () => {})
      cmd.addOptionHook('debug', () => {})
    })

    it('should reject invalid option names', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose' })
      expect(() => {
        // @ts-expect-error - 'nonexistent' is not a valid option name
        cmd.addOptionHook('nonexistent', () => {})
      }).toThrow()
    })
  })

  describe('empty command defaults', () => {
    it('should have empty args tuple', () => {
      const cmd = new Command('test')
      type _A = AssertExtends<CmdArgs<typeof cmd>, []>
    })

    it('should have default help and debug options only', () => {
      const cmd = new Command('test')
      expectTypeOf(cmd).toEqualTypeOf<Command<[], { help?: boolean; debug?: boolean }>>()
    })
  })
})
