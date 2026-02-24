import { afterEach } from "vitest";
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

  describe('addHook', () => {
    it('should use default predicate when none provided', () => {
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .addOptionHook('verbose', () => {})

      const parsed = cmd.parseArgv(['-v'])
      expect(parsed.hooks).toHaveLength(1)
    })

    it('should select hook action over main action', () => {
      let hookCalled = false
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .setAction(() => {})
        .addOptionHook('verbose', () => {
          hookCalled = true
        })

      const parsed = cmd.parseArgv(['-v'])
      void parsed.execute!()
      expect(hookCalled).toBe(true)
    })

    it('should execute main action when no hook matches', () => {
      let mainCalled = false
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .setAction(() => {
          mainCalled = true
        })
        .addOptionHook('verbose', () => {})

      const parsed = cmd.parseArgv([])
      void parsed.execute!()
      expect(mainCalled).toBe(true)
    })

    it('should execute help when no action or hook', () => {
      const cmd = new Command('test')
      const parsed = cmd.parseArgv([])
      expect(parsed.execute).toBeDefined()
    })

    it('should not trigger hook for empty variadic option', () => {
      let hookCalled = false
      const cmd = new Command('test')
        .addOption('-i, --include [patterns...]', { description: 'include patterns' })
        .addOptionHook('include', () => {
          hookCalled = true
        })

      const parsed = cmd.parseArgv([])
      expect(parsed.hooks).toHaveLength(0)
      void parsed.execute!()
      expect(hookCalled).toBe(false)
    })
  })

  describe('hook execution via execute()', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should execute debug hook body', async () => {
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      const cmd = new Command('test')
      const parsed = cmd.parseArgv(['-D'])
      await parsed.execute()
      expect(debugSpy).toHaveBeenCalledTimes(2)
    })

    it('should execute help hook body', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const cmd = new Command('test')
      const parsed = cmd.parseArgv(['-h'])
      await parsed.execute()
      expect(logSpy).toHaveBeenCalled()
      expect(process.exitCode).toBe(0)
    })

    it('should execute version hook body', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const cmd = new Command('test').setVersion('2.5.0')
      const parsed = cmd.parseArgv(['-V'])
      await parsed.execute()
      expect(logSpy).toHaveBeenCalledWith('2.5.0')
      expect(process.exitCode).toBe(0)
    })

    it('should execute main action after hooks', async () => {
      let mainCalled = false
      const cmd = new Command('test')
        .addOption('-v, --verbose', { description: 'verbose' })
        .setAction(() => {
          mainCalled = true
        })
        .addOptionHook('verbose', () => {})
      const parsed = cmd.parseArgv(['-v'])
      await parsed.execute()
      expect(mainCalled).toBe(true)
    })

    it('should print errors and exit when validation fails', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const cmd = new Command('test').addArgument('<required>')
      const parsed = cmd.parseArgv([])
      expect(parsed.errors).toBeDefined()
      await parsed.execute()
      expect(errorSpy).toHaveBeenCalled()
      expect(process.exitCode).toBe(1)
    })
  })
})
