import { Command } from './Command'
import { afterEach } from 'vitest'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

describe(Command.name, () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe(Command.prototype.addOption.name, () => {
    describe('boolean options', () => {
      it('should add boolean option', () => {
        const cmd = new Command('test')
        const countBuiltinOptions = cmd.options.length
        const result = cmd.addOption('-v, --verbose', { description: 'verbose output' })

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
        const cmd = new Command('test').addOption('-f, --format <type>', { description: 'output format' })

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
        const cmd = new Command('test').addOption('-o, --output [path]', {
          description: 'output path',
          defaultValue: 'dist',
        })

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
        const cmd = new Command('test').addOption('-o, --output [path]', { description: 'output path' })

        expect(cmd.options.pop()?.defaultValue).toBeUndefined()
      })
    })

    describe('variadic options', () => {
      it('should add required variadic option', () => {
        const cmd = new Command('test').addOption('-i, --include <patterns...>', {
          description: 'include patterns',
        })

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
        const cmd = new Command('test').addOption('-e, --exclude [patterns...]', {
          description: 'exclude patterns',
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
        const cmd = new Command('test').addOption('-e, --exclude [patterns...]', {
          description: 'exclude patterns',
        })

        expect(cmd.options.pop()?.defaultValue).toEqual([])
      })
    })

    describe('validation', () => {
      it('should throw error for invalid option format', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addOption('invalid' as any, { description: 'description' })
        }).toThrow()
      })

      it('should throw error for invalid short name', () => {
        const cmd = new Command('test')

        expect(() => {
          cmd.addOption('-12, --invalid', { description: 'description' })
        }).toThrow()
      })

      it('should throw error for duplicate option names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', { description: 'first' })

        expect(() => {
          cmd.addOption('-d, --verbose', { description: 'second' })
        }).toThrow()
      })

      it('should throw error for duplicate short names', () => {
        const cmd = new Command('test').addOption('-v, --verbose', { description: 'first' })

        expect(() => {
          cmd.addOption('-v, --wow', { description: 'second' })
        }).toThrow()
      })
    })
  })

  describe('advanced option configurations', () => {
    it('should handle options with choices', () => {
      const cmd = new Command('test').addOption('-f, --format <type>', {
        description: 'output format',
        choices: ['json', 'xml', 'yaml'],
      })

      expect(cmd.options.pop()?.choices).toEqual(['json', 'xml', 'yaml'])
    })

    it('should handle options with env variables', () => {
      const cmd = new Command('test').addOption('-t, --token <value>', {
        description: 'auth token',
        env: 'AUTH_TOKEN',
      })

      expect(cmd.options.pop()?.env).toBe('AUTH_TOKEN')
    })

    it('should handle hidden options', () => {
      const cmd = new Command('test').addOption('-H, --hidden', { description: 'hidden option', hidden: true })

      expect(cmd.options.pop()?.hidden).toBe(true)
    })

    it('should handle option groups', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose flag', group: 'logging' })

      expect(cmd.options.pop()?.group).toBe('logging')
    })
  })

  describe('validation error edge cases', () => {
    it('should allow option names that match argument names', () => {
      const cmd = new Command('test').addArgument('<file>')

      expect(() => {
        cmd.addOption('-f, --file', { description: 'file option' })
      }).not.toThrow()
    })

    it('should validate short option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose flag' })
      const child = parent.command('child')

      expect(() => {
        child.addOption('-v, --wow', { description: 'wow flag' })
      }).toThrow()
    })

    it('should validate long option names in parent-child hierarchy', () => {
      const parent = new Command('parent').addOption('-v, --verbose', { description: 'verbose flag' })
      const child = parent.command('child')

      expect(() => {
        child.addOption('-d, --verbose', { description: 'wow flag' })
      }).toThrow()
    })

    it('should validate option short names are alphanumeric', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('---, --invalid', { description: 'invalid short name' })
      }).toThrow()
    })

    it('should validate option short names are single characters', () => {
      const cmd = new Command('test')

      expect(() => {
        cmd.addOption('-ab, --invalid', { description: 'invalid short name' })
      }).toThrow()
    })

    it('should validate option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', { description: 'global flag' })
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-l, --global', { description: 'local flag' })
      }).toThrow()
    })

    it('should validate short option names do not conflict across deep hierarchy', () => {
      const grandparent = new Command('grandparent').addOption('-g, --global', { description: 'global flag' })
      const parent = grandparent.command('parent')
      const child = parent.command('child')

      expect(() => {
        child.addOption('-g, --local', { description: 'local flag' })
      }).toThrow()
    })
  })

  describe('env variable defaults for options', () => {
    afterEach(() => {
      delete process.env.TEST_BOOL
      delete process.env.TEST_VAR
      delete process.env.TEST_STR
    })

    it('should set boolean defaultValue from env when truthy', () => {
      process.env.TEST_BOOL = 'true'
      const cmd = new Command('test').addOption('-b, --bflag', { description: 'bool', env: 'TEST_BOOL' })
      const opt = cmd.options.find((o) => {
        return o.name === 'bflag'
      })!
      expect(opt.defaultValue).toBe(true)
    })

    it('should set boolean defaultValue from env when falsy', () => {
      process.env.TEST_BOOL = 'no'
      const cmd = new Command('test').addOption('-b, --bflag', { description: 'bool', env: 'TEST_BOOL' })
      const opt = cmd.options.find((o) => {
        return o.name === 'bflag'
      })!
      expect(opt.defaultValue).toBe(false)
    })

    it('should set variadic defaultValue from env', () => {
      process.env.TEST_VAR = 'a, b, c'
      const cmd = new Command('test').addOption('-t, --tags <vals...>', {
        description: 'tags',
        env: 'TEST_VAR',
      })
      const opt = cmd.options.find((o) => {
        return o.name === 'tags'
      })!
      expect(opt.defaultValue).toEqual(['a', 'b', 'c'])
    })

    it('should set string defaultValue from env', () => {
      process.env.TEST_STR = '/tmp/output'
      const cmd = new Command('test').addOption('-o, --output <path>', {
        description: 'output',
        env: 'TEST_STR',
      })
      const opt = cmd.options.find((o) => {
        return o.name === 'output'
      })!
      expect(opt.defaultValue).toBe('/tmp/output')
    })

    it('should not override existing defaultValue with env', () => {
      process.env.TEST_STR = 'from-env'
      const cmd = new Command('test').addOption('-o, --output [path]', {
        description: 'output',
        env: 'TEST_STR',
        defaultValue: 'explicit',
      })
      const opt = cmd.options.find((o) => {
        return o.name === 'output'
      })!
      expect(opt.defaultValue).toBe('explicit')
    })
  })
})
