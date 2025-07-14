import fs from 'fs-extra'
import { ensureThat, TAsyncValidator, TSyncValidator } from './ensureThat'
import { describe, expect, it } from 'vitest'

describe(ensureThat.name, () => {
  it('should validate with validator that returns boolean', () => {
    const isPositive = (n: number) => n >= 0
    try {
      ensureThat(-5, isPositive)
    } catch (error) {
      const err = error as Error
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe(`Expected '${isPositive.name}'. Got: -5`)
    }
  })
  it('should validate with validator that returns boolean or string', () => {
    const isPositive = (n: number) => (n >= 0 ? true : 'Not positive')
    try {
      ensureThat(-5, isPositive)
    } catch (error) {
      const err = error as Error
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe(`Not positive. Got: -5`)
    }
  })
  it('should throw the provided error type', () => {
    const isPositive = (n: number) => (n >= 0 ? true : 'Not positive')
    try {
      ensureThat(-5, isPositive, { Err: TypeError })
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })
  it('should validate correctly using additional args', () => {
    const isLargerThan = (n: number, min: number) => n > min
    expect(() => ensureThat(5, isLargerThan, { args: [3] })).not.toThrow()
    expect(() => ensureThat(5, isLargerThan, { args: [7] })).toThrow()
  })
  it('should validate correctly using "is" option to set alternative expected outcome', () => {
    const isLargerThan = (n: number, min: number) => n > min
    expect(() => ensureThat(5, isLargerThan, { args: [3], is: false })).toThrow()
    expect(() => ensureThat(5, isLargerThan, { args: [7], is: false })).not.toThrow()
  })

  describe('types', () => {
    it('sync', () => {
      const isString01: TSyncValidator<string, string> = (value: string, ..._args: any[]): boolean => {
        return typeof value === 'string'
      }
      const isString02: TSyncValidator<string, string> = (value: string, ..._args: any[]): value is string => {
        return typeof value === 'string'
      }
      const isString03: TSyncValidator<string, string> = (value: string, ..._args: any[]): boolean | string => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString04: TSyncValidator<string, string> = (value: string, ..._args: any[]): true | string => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString05: TSyncValidator<string, unknown> = (value: unknown, ..._args: any[]): boolean => {
        return typeof value === 'string'
      }
      const isString06: TSyncValidator<string, unknown> = (value: unknown, ..._args: any[]): value is string => {
        return typeof value === 'string'
      }
      const isString07: TSyncValidator<string, unknown> = (value: unknown, ..._args: any[]): boolean | string => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString08: TSyncValidator<string, unknown> = (value: unknown, ..._args: any[]): true | string => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }

      expect(ensureThat('string', isString01)).toBe('string')
      expect(ensureThat('string', isString02)).toBe('string')
      expect(ensureThat('string', isString03)).toBe('string')
      expect(ensureThat('string', isString04)).toBe('string')

      expect(ensureThat('string', isString05)).toBe('string')
      expect(ensureThat('string', isString06)).toBe('string')
      expect(ensureThat('string', isString07)).toBe('string')
      expect(ensureThat('string', isString08)).toBe('string')

      expect(() => ensureThat(1, isString05)).toThrow("Expected 'isString05'. Got: 1")
      expect(() => ensureThat(1, isString06)).toThrow("Expected 'isString06'. Got: 1")
      expect(() => ensureThat(1, isString07)).toThrow('Expected string. Got: 1')
      expect(() => ensureThat(1, isString08)).toThrow('Expected string. Got: 1')
    })

    it('async', async () => {
      const isString09: TAsyncValidator<string, string> = async (
        value: string,
        ..._args: any[]
      ): Promise<boolean> => {
        return typeof value === 'string'
      }
      const isString10: TAsyncValidator<string, string> = async (
        value: string,
        ..._args: any[]
      ): Promise<boolean | string> => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString11: TAsyncValidator<string, string> = async (
        value: string,
        ..._args: any[]
      ): Promise<true | string> => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString12: TAsyncValidator<string, unknown> = async (
        value: unknown,
        ..._args: any[]
      ): Promise<boolean> => {
        return typeof value === 'string'
      }
      const isString13: TAsyncValidator<string, unknown> = async (
        value: unknown,
        ..._args: any[]
      ): Promise<boolean | string> => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }
      const isString14: TAsyncValidator<string, unknown> = async (
        value: unknown,
        ..._args: any[]
      ): Promise<true | string> => {
        if (typeof value !== 'string') return 'Expected string'
        return true
      }

      expect(await ensureThat('string', isString09)).toBe('string')
      expect(await ensureThat('string', isString10)).toBe('string')
      expect(await ensureThat('string', isString11)).toBe('string')

      expect(await ensureThat('string', isString12)).toBe('string')
      expect(await ensureThat('string', isString13)).toBe('string')
      expect(await ensureThat('string', isString14)).toBe('string')

      await expect(() => ensureThat(1, isString12)).rejects.toThrow("Expected 'isString12'. Got: 1")
      await expect(() => ensureThat(1, isString13)).rejects.toThrow('Expected string. Got: 1')
      await expect(() => ensureThat(1, isString14)).rejects.toThrow('Expected string. Got: 1')
    })

    it('async fs', async () => {
      const isExistent = (value: string) => fs.exists(value)
      expect(await ensureThat(process.cwd(), isExistent)).toBe(process.cwd())
    })
  })
})
