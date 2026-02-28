import * as ValidatorErrorModule from './ValidatorError'
import { beforeEach } from 'vitest'
import { describe } from 'vitest'
import { ensureThat } from './ensureThat'
import { expect } from 'vitest'
import { expectTypeOf } from 'vitest'
import { it } from 'vitest'
import { vi } from 'vitest'

describe(ensureThat.name, () => {
  const isZero = (n: unknown) => {
    return typeof n === 'number' && n === 0
  }
  const isPos = (n: unknown) => {
    return typeof n === 'number' && n >= 0
  }
  const isNeg = (n: unknown) => {
    return typeof n === 'number' && n < 0
  }

  const isZeroAsync = async (n: unknown) => {
    return typeof n === 'number' && n === 0
  }
  const isPosAsync = async (n: unknown) => {
    return typeof n === 'number' && n >= 0
  }

  let errSpy = vi.spyOn(ValidatorErrorModule, 'ValidatorError')

  beforeEach(() => {
    errSpy = vi.spyOn(ValidatorErrorModule, 'ValidatorError')
  })

  const expectErrorData = (data: ConstructorParameters<typeof ValidatorErrorModule.ValidatorError>[1]) => {
    expect(errSpy).toHaveBeenCalledWith(
      // message
      expect.any(String),
      // data
      expect.objectContaining(data),
    )
  }

  const expectThrowsWith = (
    f: () => void,
    data: ConstructorParameters<typeof ValidatorErrorModule.ValidatorError>[1],
  ) => {
    expect(f).toThrow()
    expectErrorData(data)
  }

  describe('should pass when all validators return true', () => {
    it('validator => true => pass', () => {
      expect(() => {
        return ensureThat(3, isPos)
      }).not.toThrow()
    })
    it('[validator] => [true] => pass', () => {
      expect(() => {
        return ensureThat(3, [isPos])
      }).not.toThrow()
    })
    it('validator[] => [true, true] => pass', () => {
      expect(() => {
        return ensureThat(0, [isZero, isPos])
      }).not.toThrow()
    })
  })

  describe('should throw when all validators return false', () => {
    it('validator => false => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(-1, isPos)
        },
        {
          cause: { isPos: false },
        },
      )
    })
    it('[validator] => [false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(-1, [isPos])
        },
        {
          cause: { isPos: false },
        },
      )
    })
    it('validator[] => [false, false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(3, [isZero, isNeg])
        },
        {
          cause: { isZero: false, isNeg: false },
        },
      )
    })
  })

  describe('should throw when any validator returns false', () => {
    it('validator[] => [false, true] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(0, [isNeg, isZero])
        },
        {
          cause: { isNeg: false },
        },
      )
    })
    it('validator[] => [true, false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(0, [isZero, isNeg])
        },
        {
          cause: { isNeg: false },
        },
      )
    })
  })

  describe('should negate all validator return values when negate option is enabled', () => {
    // all true
    it('validator => true, negate => false => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(3, isPos, { negate: true })
        },
        {
          cause: { isPos: true },
        },
      )
    })
    it('[validator] => [true], negate => [false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(3, [isPos], { negate: true })
        },
        {
          cause: { isPos: true },
        },
      )
    })
    it('validator[] => [true, true], negate => [false, false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(0, [isZero, isPos], { negate: true })
        },
        {
          cause: { isZero: true, isPos: true },
        },
      )
    })

    // both true and false
    it('validator[] => [true, false], negate => [false, true] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(0, [isZero, isNeg], { negate: true })
        },
        {
          cause: { isZero: true },
        },
      )
    })
    it('validator[] => [false, true], negate => [true, false] => throws', () => {
      expectThrowsWith(
        () => {
          return ensureThat(0, [isNeg, isZero], { negate: true })
        },
        {
          cause: { isZero: true },
        },
      )
    })

    // all false
    it('[validator] => false, negate => true => pass', () => {
      expect(() => {
        return ensureThat(3, isNeg, { negate: true })
      }).not.toThrow()
    })
    it('[validator] => [false], negate => [true] => pass', () => {
      expect(() => {
        return ensureThat(3, [isNeg], { negate: true })
      }).not.toThrow()
    })
    it('validator[] => [false, false], negate => [true, true] => pass', () => {
      expect(() => {
        return ensureThat(3, [isZero, isNeg], { negate: true })
      }).not.toThrow()
    })
  })

  describe('should always pass when no validators are provided', () => {
    it('[] => [] => pass', () => {
      expect(() => {
        return ensureThat(2 as never, [])
      }).not.toThrow()
    })
    it('[] => [], negate => pass', () => {
      expect(() => {
        return ensureThat(2 as never, [], { negate: true })
      }).not.toThrow()
    })
  })

  describe('async', () => {
    it('only async validators', async () => {
      await expect(ensureThat(0, isZeroAsync)).resolves.toBe(0)
      await expect(ensureThat(0, [isZeroAsync])).resolves.toBe(0)
      await expect(ensureThat(0, [isZeroAsync, isPosAsync])).resolves.toBe(0)

      await expect(ensureThat(1, isZeroAsync)).rejects.toThrow()
      await expect(ensureThat(1, [isZeroAsync])).rejects.toThrow()
      await expect(ensureThat(1, [isZeroAsync, isPosAsync])).rejects.toThrow()
    })

    it('mixed sync and async validators', async () => {
      await expect(ensureThat(0, [isZero, isZeroAsync])).resolves.toBe(0)
      await expect(ensureThat(3, [isZero, isZeroAsync])).rejects.toThrow()
    })
  })

  describe('unnamed functions', () => {
    it('anonymous validator', () => {
      expect(() => {
        return ensureThat(5, (n: unknown) => {
          return true
        })
      }).not.toThrow()

      expect(() => {
        return ensureThat(5, (n: unknown) => {
          return false
        })
      }).toThrow()
      expectErrorData({
        cause: { '[0]': false },
      })

      expect(() => {
        return ensureThat(5, [
          isZero,
          (n: unknown) => {
            return false
          },
        ])
      }).toThrow()
      expectErrorData({
        cause: { 'isZero': false, '[1]': false },
      })
    })
  })

  describe('validators returning strings', () => {
    const stringFail = (n: unknown) => {
      return 'failure reason' as string | true
    }

    it('string-returning validator failure', () => {
      expect(() => {
        return ensureThat(1, stringFail)
      }).toThrow()
      expectErrorData({
        cause: { stringFail: 'failure reason' },
      })
    })

    it('anonymous string-returning validator failure', () => {
      expect(() => {
        return ensureThat(1, (n: unknown) => {
          return 'failure reason' as string | true
        })
      }).toThrow()
      expectErrorData({
        cause: { '[0]': 'failure reason' },
      })
    })

    it('anonymous mixed boolean and string returning validator failure', () => {
      expect(() => {
        return ensureThat(1, [
          isZero,
          (n: unknown) => {
            return 'failure reason' as string | true
          },
        ])
      }).toThrow()
      expectErrorData({
        cause: { 'isZero': false, '[1]': 'failure reason' },
      })
    })

    it('string-returning validator with negate', () => {
      expect(() => {
        return ensureThat(1, stringFail, { negate: true })
      }).not.toThrow()
      expect(() => {
        return ensureThat(1, [stringFail], { negate: true })
      }).not.toThrow()
    })
  })

  describe('custom message option', () => {
    it('should use custom message when provided', () => {
      expect(() => {
        return ensureThat(-1, isPos, { message: 'Custom error' })
      }).toThrow()
      expectErrorData({
        cause: { isPos: false },
      })
      expect(errSpy).toHaveBeenCalledWith('Custom error', expect.any(Object))
    })
  })

  describe('typing tests', () => {
    const unknownParam = (n: unknown) => {
      return true
    }
    const stringParam = (n: string) => {
      return true
    }

    const syncBool = (n: number) => {
      return n > 0
    }
    const syncString = (n: number) => {
      return n > 0 ? true : 'bad'
    }
    const asyncBool = async (n: number) => {
      return n > 0
    }
    const asyncString = async (n: number) => {
      return n > 0 ? true : 'bad'
    }

    it('accepts single sync validator', () => {
      expectTypeOf(ensureThat).toBeFunction()
    })

    it('accepts array of sync validators', () => {
      ensureThat(1, [syncBool, syncString])
    })

    it('infers return type correctly (sync)', () => {
      expectTypeOf(ensureThat(1, unknownParam)).toEqualTypeOf<number>()
      expectTypeOf(ensureThat(undefined, unknownParam)).toEqualTypeOf<undefined>()
      expectTypeOf(ensureThat(2 as never, unknownParam)).toEqualTypeOf<never>()
      expectTypeOf(ensureThat(null, unknownParam)).toEqualTypeOf<null>()
      expectTypeOf(ensureThat('x', stringParam)).toEqualTypeOf<string>()
      expectTypeOf(ensureThat(undefined, unknownParam)).toEqualTypeOf<undefined>()
      expectTypeOf(ensureThat(1, syncBool)).toEqualTypeOf<number>()
    })

    it('accepts async validators', async () => {
      await ensureThat(1, asyncBool)
      await ensureThat(1, [asyncBool, asyncString])
    })

    it('infers return type correctly (async)', async () => {
      const result = ensureThat(1, asyncBool)
      expectTypeOf(result).toEqualTypeOf<Promise<1>>()
      await result
    })
  })
})
