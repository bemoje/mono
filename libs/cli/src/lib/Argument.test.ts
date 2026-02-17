import { describe, expect, it } from 'vitest'
import { Argument } from './Argument'
import type { ICommand } from './types'

function mockCmd(args: Partial<{ required: boolean; variadic: boolean }>[] = []): ICommand {
  return {
    arguments: args,
    options: [],
    commands: [],
    aliases: [],
    name: 'test',
    description: '',
  } as unknown as ICommand
}

describe(Argument.name, () => {
  describe('constructor', () => {
    it('should create a required argument', () => {
      const arg = new Argument(mockCmd(), '<name>', 'The name')
      expect(arg.usage).toBe('<name>')
      expect(arg.name).toBe('name')
      expect(arg.description).toBe('The name')
      expect(arg.required).toBe(true)
      expect(arg.variadic).toBeUndefined()
    })

    it('should default description to empty string', () => {
      const arg = new Argument(mockCmd(), '<name>')
      expect(arg.description).toBe('')
    })

    it('should create an optional argument', () => {
      const arg = new Argument(mockCmd(), '[name]', 'Optional name')
      expect(arg.usage).toBe('[name]')
      expect(arg.name).toBe('name')
      expect(arg.required).toBeUndefined()
      expect(arg.variadic).toBeUndefined()
    })

    it('should create a required variadic argument', () => {
      const arg = new Argument(mockCmd(), '<files...>', 'Files')
      expect(arg.name).toBe('files')
      expect(arg.required).toBe(true)
      expect(arg.variadic).toBe(true)
    })

    it('should create an optional variadic argument with default empty array', () => {
      const arg = new Argument(mockCmd(), '[files...]', 'Files')
      expect(arg.name).toBe('files')
      expect(arg.required).toBeUndefined()
      expect(arg.variadic).toBe(true)
      expect(arg.defaultValue).toEqual([])
    })

    it('should use provided defaultValue for optional variadic', () => {
      const arg = new Argument(mockCmd(), '[files...]', 'Files', { defaultValue: ['a.txt'] })
      expect(arg.defaultValue).toEqual(['a.txt'])
    })

    it('should assign extra options', () => {
      const arg = new Argument(mockCmd(), '<name>', 'Name', { choices: ['a', 'b'] })
      expect(arg.choices).toEqual(['a', 'b'])
    })

    it('should throw for invalid argument format', () => {
      expect(() => new Argument(mockCmd(), 'invalid' as never)).toThrow('Invalid argument format: invalid')
    })
  })

  describe('assertion guards', () => {
    it('should throw if adding a required argument after an optional argument', () => {
      expect(() => new Argument(mockCmd([{ required: false }]), '<name>')).toThrow(
        'Cannot add required argument after optional or variadic arguments',
      )
    })

    it('should throw if adding a required argument after a variadic argument', () => {
      expect(() => new Argument(mockCmd([{ required: false, variadic: true }]), '<name>')).toThrow(
        'Cannot add required argument after optional or variadic arguments',
      )
    })

    it('should throw if adding a second required variadic argument', () => {
      expect(() => new Argument(mockCmd([{ variadic: true }]), '<files...>')).toThrow(
        'Cannot add more than one variadic argument',
      )
    })

    it('should throw if adding a second optional variadic argument', () => {
      expect(() => new Argument(mockCmd([{ variadic: true }]), '[files...]')).toThrow(
        'Cannot add more than one variadic argument',
      )
    })

    it('should throw if adding an optional argument after a variadic argument', () => {
      expect(() => new Argument(mockCmd([{ variadic: true }]), '[name]')).toThrow(
        'Cannot add optional argument after variadic argument',
      )
    })
  })
})
