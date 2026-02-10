import { afterEach, describe, expect, it } from 'vitest'
import { Option } from './Option'
import type { ICommand } from './types'

function mockCmd(): ICommand {
  return {
    options: [],
    arguments: [],
    commands: [],
    aliases: [],
    name: 'test',
    description: '',
  } as unknown as ICommand
}

describe(Option.name, () => {
  describe('constructor', () => {
    it('should create a boolean option', () => {
      const opt = new Option(mockCmd(), '-v, --verbose', 'Enable verbose mode')
      expect(opt.type).toBe('boolean')
      expect(opt.short).toBe('v')
      expect(opt.long).toBe('verbose')
      expect(opt.name).toBe('verbose')
      expect(opt.description).toBe('Enable verbose mode')
    })

    it('should default description to empty string', () => {
      const opt = new Option(mockCmd(), '-v, --verbose')
      expect(opt.description).toBe('')
    })

    it('should create a required string option', () => {
      const opt = new Option(mockCmd(), '-f, --file <path>', 'File path')
      expect(opt.type).toBe('string')
      expect(opt.argName).toBe('path')
      expect(opt.required).toBe(true)
      expect(opt.variadic).toBeUndefined()
    })

    it('should create a required variadic option', () => {
      const opt = new Option(mockCmd(), '-i, --include <patterns...>', 'Include patterns')
      expect(opt.type).toBe('string')
      expect(opt.required).toBe(true)
      expect(opt.variadic).toBe(true)
    })

    it('should create an optional string option', () => {
      const opt = new Option(mockCmd(), '-o, --output [path]', 'Output path')
      expect(opt.type).toBe('string')
      expect(opt.argName).toBe('path')
      expect(opt.required).toBeUndefined()
      expect(opt.variadic).toBeUndefined()
    })

    it('should create an optional variadic option with default', () => {
      const opt = new Option(mockCmd(), '-e, --exclude [patterns...]', 'Exclude patterns')
      expect(opt.type).toBe('string')
      expect(opt.variadic).toBe(true)
      expect(opt.defaultValue).toEqual([])
    })

    it('should use provided defaultValue for optional variadic', () => {
      const opt = new Option(mockCmd(), '-e, --exclude [patterns...]', 'Exclude', {
        defaultValue: ['node_modules'],
      })
      expect(opt.defaultValue).toEqual(['node_modules'])
    })

    it('should assign extra options', () => {
      const opt = new Option(mockCmd(), '-v, --verbose', 'Verbose', {
        hidden: true,
        group: 'Debug',
      })
      expect(opt.hidden).toBe(true)
      expect(opt.group).toBe('Debug')
    })
  })

  describe('env variable defaultValue', () => {
    const envKey = 'TEST_CLI_OPT_ENV'

    afterEach(() => {
      delete process.env[envKey]
    })

    it('should set boolean defaultValue from env', () => {
      process.env[envKey] = 'true'
      const opt = new Option(mockCmd(), '-v, --verbose', 'Verbose', { env: envKey })
      expect(opt.defaultValue).toBe(true)
    })

    it('should set boolean defaultValue false from env', () => {
      process.env[envKey] = 'no'
      const opt = new Option(mockCmd(), '-v, --verbose', 'Verbose', { env: envKey })
      expect(opt.defaultValue).toBe(false)
    })

    it('should set variadic defaultValue from env', () => {
      process.env[envKey] = 'a, b, c'
      const opt = new Option(mockCmd(), '-i, --include <patterns...>', 'Include', { env: envKey })
      expect(opt.defaultValue).toEqual(['a', 'b', 'c'])
    })

    it('should set string defaultValue from env', () => {
      process.env[envKey] = '/tmp/out'
      const opt = new Option(mockCmd(), '-o, --output [path]', 'Output', { env: envKey })
      expect(opt.defaultValue).toBe('/tmp/out')
    })

    it('should not override existing defaultValue with env', () => {
      process.env[envKey] = 'from-env'
      const opt = new Option(mockCmd(), '-o, --output [path]', 'Output', {
        env: envKey,
        defaultValue: 'explicit',
      })
      expect(opt.defaultValue).toBe('explicit')
    })
  })
})
