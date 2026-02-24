import { describe, expectTypeOf, it } from 'vitest'
import type { Arguments, Options } from './types'
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

    it('should type execute as optional function returning void or Promise<void>', () => {
      const cmd = new Command('test').setAction(() => {})
      const result = cmd.parseArgv([])
      expectTypeOf(result.execute).toEqualTypeOf<() => Promise<void>>()
    })

    it('should type action as optional string', () => {
      const result = new Command('test').parseArgv([])
      expectTypeOf(result.action).toEqualTypeOf<string>()
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
      const parent = new Command('parent').addArgument('<input>')
      const sub = parent.command('sub')
      type _A = AssertExtends<CmdArgs<typeof sub>, []>
    })

    it('should allow subcommand to add its own arguments', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose' })
      const sub = parent.command('sub').addArgument('<file>')
      type _A = AssertExtends<CmdArgs<typeof sub>, [string]>
      type _O = AssertExtends<CmdOpts<typeof sub>, { verbose?: boolean }>
    })
  })
})
