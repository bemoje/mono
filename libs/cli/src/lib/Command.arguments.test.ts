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

      it('should use undefined as default when not provided', () => {
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
          defaultValue: [],
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

  describe('addArgument edge cases', () => {
    it('should throw when adding required argument after optional with default', () => {
      expect(() => {
        const cmd = new Command('test').addArgument('[opt]', { defaultValue: 'x' })
        ;(cmd as unknown as Command).addArgument('<req>' as never)
      }).toThrow()
    })

    it('should throw when adding required argument after required with defaultValue', () => {
      expect(() => {
        // A required arg with defaultValue is unusual but possible via options spread
        const cmd = new Command('test').addArgument('<first>', { defaultValue: 'x' } as never)
        ;(cmd as unknown as Command).addArgument('<second>' as never)
      }).toThrow(/after optional argument with default value/)
    })
  })
})
