import colors from 'ansi-colors'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import { FunctionProfiler } from '../FunctionProfiler/FunctionProfiler'
import { inspect } from 'util'
import { Profiler } from './Profiler'

describe(Profiler.name, () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    FunctionProfiler.instances = []
  })

  describe(Profiler.classStatic.name, () => {
    class Target {
      static method() {
        return 1
      }
      static _value = 0
      static get value() {
        return this._value
      }
      static set value(value) {
        this._value = value
      }
    }

    it('should profile methods', () => {
      Profiler.classStatic(Target)
      expect(Target.method()).toBe(1)
      Target.value = 1
      expect(Target.value).toBe(1)
      expect(Profiler.data.length).toBe(3)
      for (const profiler of Profiler.data) {
        if (profiler.id.targetType === 'static') {
          expect(profiler.id.target).toBe(Target)
        } else {
          expect(profiler.id.target).toBe(Target.prototype)
        }
      }
      const results = new Map(Profiler.getResults())
      expect(results.has('Target.method()')).toBe(true)
      expect(results.has('Target.value')).toBe(true)
      expect(results.has('Target.value[set]')).toBe(true)
    })

    it('ignore keys', () => {
      Profiler.class(Target, { ignoreStaticKeys: ['value'] })
      expect(Profiler.data.length).toBe(1)
    })

    it('should do nothing if Profiler is disabled', () => {
      Profiler.enabled = false
      Profiler.classStatic(Target)
      Profiler.enabled = true
      expect(Profiler.data.length).toBe(0)
    })
  })

  describe(Profiler.classPrototype.name, () => {
    class Target {
      _value = 0
      get value() {
        return this._value
      }
      set value(value) {
        this._value = value
      }
      method() {
        return 1
      }
    }

    it('should profile methods', () => {
      Profiler.classPrototype(Target)
      const instance = new Target()
      expect(instance.method()).toBe(1)
      instance.value = 1
      expect(instance.value).toBe(1)
      expect(Profiler.data.length).toBe(3)
      for (const profiler of Profiler.data) {
        expect(profiler.id.target).toBe(Target.prototype)
      }
      const results = new Map(Profiler.getResults())
      expect(results.has('Target.prototype.method()')).toBe(true)
      expect(results.has('Target.prototype.value')).toBe(true)
      expect(results.has('Target.prototype.value[set]')).toBe(true)
    })

    it('ignore keys', () => {
      Profiler.class(Target, { ignorePrototypeKeys: ['value'] })
      expect(Profiler.data.length).toBe(1)
    })

    it('should do nothing if Profiler is disabled', () => {
      Profiler.enabled = false
      Profiler.classPrototype(Target)
      Profiler.enabled = true
      expect(Profiler.data.length).toBe(0)
    })
  })

  describe(Profiler.class.name, () => {
    it('should profile static and prototype methods', () => {
      const classStaticSpy = vitest.spyOn(Profiler, 'classStatic')
      const classPrototypeSpy = vitest.spyOn(Profiler, 'classPrototype')
      class Target {}
      const options = {
        ignoreStaticKeys: [],
        ignorePrototypeKeys: [],
      }
      Profiler.class(Target, options)
      expect(classStaticSpy).toHaveBeenCalledWith(Target, options.ignoreStaticKeys)
      expect(classPrototypeSpy).toHaveBeenCalledWith(Target, options.ignorePrototypeKeys)
    })

    describe('decorator', () => {
      it('no options', () => {
        @Profiler.class
        class C {
          fn1() {}
          fn2() {}
          fn3() {}
        }
        expect(new C()).toBeInstanceOf(C)
        expect(Profiler.data.length).toBe(3)
      })

      it('options as call argument', () => {
        @Profiler.class({ ignorePrototypeKeys: ['fn3'] })
        class C {
          fn1() {}
          fn2() {}
          fn3() {}
        }
        expect(new C()).toBeInstanceOf(C)
        expect(Profiler.data.length).toBe(2)
      })

      it('options as static property', () => {
        @Profiler.class
        class C {
          static profiler = { ignorePrototypeKeys: ['fn2'] }
          fn1() {}
          fn2() {}
          fn3() {}
        }
        expect(new C()).toBeInstanceOf(C)
        expect(Profiler.data.length).toBe(2)
      })

      it('options as call argument and as static property are merged', () => {
        @Profiler.class({ ignorePrototypeKeys: ['fn3'] })
        class C {
          static profiler = { ignorePrototypeKeys: ['fn2'] }
          fn1() {}
          fn2() {}
          fn3() {}
        }
        expect(new C()).toBeInstanceOf(C)
        expect(Profiler.data.length).toBe(1)
      })
    })
  })

  describe(Profiler.module.name, () => {
    const Target = {
      _value: 0,
      get value() {
        return this._value
      },
      set value(value) {
        this._value = value
      },
      method() {
        return 1
      },
    }

    it('should profile methods', () => {
      Profiler.module(Target, 'Target')
      expect(Target.method()).toBe(1)
      Target.value = 1
      expect(Target.value).toBe(1)
      expect(Profiler.data.length).toBe(3)
      for (const profiler of Profiler.data) {
        expect(profiler.id.target).toBe(Target)
      }
      const results = new Map(Profiler.getResults())
      expect(results.has('Target.method()')).toBe(true)
      expect(results.has('Target.value')).toBe(true)
      expect(results.has('Target.value[set]')).toBe(true)
    })

    it('ignore keys', () => {
      Profiler.module(Target, 'Target', ['value'])
      expect(Profiler.data.length).toBe(1)
    })

    it('should do nothing if Profiler is disabled', () => {
      Profiler.enabled = false
      Profiler.module(Target, 'Target')
      Profiler.enabled = true
      expect(Profiler.data.length).toBe(0)
    })
  })

  describe(Profiler.fn.name, () => {
    const Target = () => 1

    it('should profile function', () => {
      Profiler.fn(Target)
      expect(Target()).toBe(1)
      expect(Profiler.data.length).toBe(1)
      const results = new Map(Profiler.getResults())
      expect(results.has('Target()')).toBe(true)
    })

    it('should throw if function has no name', () => {
      expect(() => Profiler.fn(() => 1)).toThrow()
    })

    it('should not throw if function has no name but name is given', () => {
      expect(() => Profiler.fn('someName', () => 1)).not.toThrow()
    })

    it('should return input function if Profiler is disabled', () => {
      const fn = () => 1
      Profiler.enabled = false
      const wrapped = Profiler.fn(fn)
      Profiler.enabled = true
      expect(wrapped).toBe(fn)
    })
  })

  describe('data', () => {
    it('should return a copy of FunctionProfiler.instances', () => {
      FunctionProfiler.instances = ['a' as unknown as FunctionProfiler<object>]
      expect(Profiler.data).not.toBe(FunctionProfiler.instances)
      expect(Profiler.data).toEqual(FunctionProfiler.instances)
    })
  })

  describe('getResults', () => {
    class A {
      static fnA() {}
    }
    class B {
      static fnB() {}
    }
    function fnC() {}

    beforeEach(() => {
      Profiler.classStatic(A)
      Profiler.classStatic(B)
      Profiler.fn(fnC)
    })

    it('should be an Array', () => {
      const results = Profiler.getResults()
      expect(results).toBeInstanceOf(Array)
    })

    it('should have expected length', () => {
      const results = Profiler.getResults()
      expect(results).toHaveLength(3)
    })

    it('should return entries of [name, profiler results]', () => {
      for (const result of Profiler.getResults()) {
        expect(result).toBeInstanceOf(Array)
        expect(result).toHaveLength(2)
        const name = result[0]
        expect(name).toBeTypeOf('string')
        const data = result[1]
        expect(data).toBeTypeOf('object')
        const profiler = FunctionProfiler.instances.find((profiler) => profiler.id.name === name)
        expect(profiler).toBeInstanceOf(FunctionProfiler)
        expect(profiler!.getResult()).toEqual(data)
      }
    })

    describe('options', () => {
      it('sortBy calls (primary) -> totalTimeUs (auto secondary)', () => {
        FunctionProfiler.instances = [
          { id: { name: 'A' }, getResult: () => ({ calls: 1, totalTimeUs: 3 }) },
          { id: { name: 'B' }, getResult: () => ({ calls: 2, totalTimeUs: 1 }) },
          { id: { name: 'C' }, getResult: () => ({ calls: 2, totalTimeUs: 2 }) },
          { id: { name: 'D' }, getResult: () => ({ calls: 3, totalTimeUs: 3 }) },
        ].reverse() as FunctionProfiler<object>[]

        const results = Profiler.getResults({ sortBy: 'calls' })
        const names = results.map(([name]) => name).join(', ')
        expect(
          [
            'A', //
            'B', //
            'C', //
            'D', //
          ].join(', '),
        ).toBe(names)
      })

      it('sortBy totalTimeUs (primary) -> calls (auto secondary)', () => {
        FunctionProfiler.instances = [
          { id: { name: 'A' }, getResult: () => ({ calls: 3, totalTimeUs: 1 }) },
          { id: { name: 'B' }, getResult: () => ({ calls: 1, totalTimeUs: 2 }) },
          { id: { name: 'C' }, getResult: () => ({ calls: 2, totalTimeUs: 2 }) },
          { id: { name: 'D' }, getResult: () => ({ calls: 3, totalTimeUs: 3 }) },
        ].reverse() as FunctionProfiler<object>[]

        const results = Profiler.getResults({ sortBy: 'totalTimeUs' })
        const names = results.map(([name]) => name).join(', ')
        expect(
          [
            'A', //
            'B', //
            'C', //
            'D', //
          ].join(', '),
        ).toBe(names)
      })

      it('sortBy should consider undefined as lowest sort value', () => {
        FunctionProfiler.instances = [
          { id: { name: 'A' }, getResult: () => ({ calls: 0, totalTimeUs: undefined }) },
          { id: { name: 'B' }, getResult: () => ({ calls: 0, totalTimeUs: 0 }) },
        ].reverse() as FunctionProfiler<object>[]

        const results = Profiler.getResults({ sortBy: 'totalTimeUs' })
        const names = results.map(([name]) => name).join(', ')
        expect(
          [
            'A', //
            'B', //
          ].join(', '),
        ).toBe(names)
      })
    })
  })

  describe('printResults', () => {
    class A {
      static fnA() {}
    }
    class B {
      static fnB() {}
    }
    function fnC() {}

    beforeEach(() => {
      Profiler.classStatic(A).fnA()
      Profiler.classStatic(B).fnB()
      Profiler.fn(fnC)()
    })

    const NO_DATA_MIN_NUM_CONSOLE_LOGS = 6
    const NUM_PROFILERS = 3

    it('should call console.log with results', () => {
      const consoleLogSpy = vitest.spyOn(console, 'log').mockImplementation(() => {})
      Profiler.printResults()
      expect(consoleLogSpy).toHaveBeenCalledTimes(NO_DATA_MIN_NUM_CONSOLE_LOGS + NUM_PROFILERS)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String))
    })

    it('options.update should allow for editing results before printing', () => {
      const consoleLogSpy = vitest.spyOn(console, 'log').mockImplementation(() => {})
      Profiler.printResults({
        update: (entries) => entries.slice(0, 1),
      })
      expect(consoleLogSpy).toHaveBeenCalledTimes(NO_DATA_MIN_NUM_CONSOLE_LOGS + 1)
    })

    it('options.noColor', () => {
      let logged: string[] = []
      vitest.spyOn(console, 'log').mockImplementation((s: string = '') => {
        logged.push(s)
      })

      Profiler.printResults({ noColor: false })
      const withColor = logged.join('\n')
      logged = []

      Profiler.printResults({ noColor: true })
      const withoutColor = logged.join('\n')

      expect(withoutColor).not.toBe(withColor)
      expect(withoutColor).toBe(colors.stripColor(withColor))
    })
  })

  it('[inspect.custom]()', () => {
    const actual = (Profiler[inspect.custom as keyof Profiler] as typeof Function.prototype)()
    expect(actual).toEqual(Object.fromEntries(Profiler.getResults()))
  })

  it('toJSON()', () => {
    expect(Profiler.toJSON()).toEqual(Profiler.getResults())
  })
})
