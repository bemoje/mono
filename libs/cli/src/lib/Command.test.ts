import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Command } from './Command'

describe(Command.name, () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
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
        expect(cmd.aliases).toEqual(['t', 'tc', 'tst', 'test-cmd'])
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
        expect(cmd.aliases).toEqual(['t', 'tc', 'tst', 'test-cmd'])
        expect(result).toBe(cmd) // Should return this for chaining
      })

      it('should add aliases from nested arrays', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t'])
        cmd.addAliases(['tst'], ['test-cmd', 'tc'])
        expect(cmd.aliases).toEqual(['t', 'tc', 'tst', 'test-cmd'])
      })

      it('should add aliases from mixed string and array arguments', () => {
        const cmd = new Command('test')
        cmd.setAliases(['t'])
        cmd.addAliases('tst', ['test-cmd'], 'tc')
        expect(cmd.aliases).toEqual(['t', 'tc', 'tst', 'test-cmd'])
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
      cmd.addOption('-v, --verbose', { description: 'verbose output' })
      const child = cmd.command('child')
      cmd.addArgument('<input>')

      expect(cmd.name).toBe('test')
      expect(cmd.version).toBe('1.0.0')
      expect(cmd.aliases).toEqual(['t', 'tst'])
      expect(cmd.summary).toBe('Test summary')
      expect(cmd.description).toBe('Test description')
      expect(cmd.hidden).toBe(true)
      expect(cmd.group).toBe('utilities')
      expect(cmd.parent).toBe(parent)
      expect(Object.values(cmd.commands)).toContain(child)
      expect(cmd.arguments).toHaveLength(1)
      expect(cmd.options).toHaveLength(2)
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
      const cmd = new Command('test').addOption('-o, --output [path]', { description: 'output path' })

      expect(cmd.options.pop()?.defaultValue).toBeUndefined()
    })

    it('should handle complex default values for variadic arguments', () => {
      const cmd = new Command('test').addArgument('[files...]', { defaultValue: ['src/**/*.ts'] })

      expect(cmd.arguments[0].defaultValue).toEqual(['src/**/*.ts'])
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

  describe(Command.prototype.castOptions.name, () => {
    it('should return the options object cast to the command type', () => {
      const cmd = new Command('test').addOption('-v, --verbose', { description: 'verbose' })
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
  })
})
