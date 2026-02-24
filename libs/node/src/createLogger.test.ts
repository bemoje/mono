import colors from 'ansi-colors'
import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { vi } from "vitest";
import { createLogger } from "./createLogger";
import type { Logger } from "./createLogger";

describe(createLogger.name, () => {
  it('should return an object with all logger methods', () => {
    const log = createLogger('test')
    expect(log).toHaveProperty('start')
    expect(log).toHaveProperty('done')
    expect(log).toHaveProperty('info')
    expect(log).toHaveProperty('warn')
    expect(log).toHaveProperty('error')
    expect(log).toHaveProperty('debug')
  })

  it('should have all methods as functions', () => {
    const log = createLogger('test')
    expect(typeof log.start).toBe('function')
    expect(typeof log.done).toBe('function')
    expect(typeof log.info).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.error).toBe('function')
    expect(typeof log.debug).toBe('function')
  })

  it('should call console.info for start', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.start('beginning')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.info for done', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.done('finished')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.info for info', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.info('message')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.warn for warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.warn('warning')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.error for error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.error('error')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.debug for debug', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.debug('debug info')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.log for log', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.log('hello')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should call console.log for log with name prefix when name is provided', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('myTask')
    log.log('hello', 'world')
    expect(spy).toHaveBeenCalledTimes(1)
    const callArgs = spy.mock.calls[0]
    expect(callArgs.length).toBe(3)
    expect(callArgs[1]).toBe('hello')
    expect(callArgs[2]).toBe('world')
    spy.mockRestore()
  })

  it('should call console.log for log without prefix when name is empty', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const log = createLogger('')
    log.log('hello', 'world')
    expect(spy).toHaveBeenCalledWith('hello', 'world')
    spy.mockRestore()
  })

  it('should handle empty name', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const log = createLogger('')
    log.start('beginning')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should color primitive args and pass non-primitive args as-is', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const obj = { key: 'value' }
    const log = createLogger('test')
    log.info('text', 42, obj)
    const callArgs = spy.mock.calls[0]
    // Non-primitive arg should be passed through unchanged
    expect(callArgs).toContain(obj)
    spy.mockRestore()
  })

  it('should pass through already-colored string args unchanged', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const coloredStr = colors.red('already colored')
    const log = createLogger('test')
    log.info(coloredStr)
    const callArgs = spy.mock.calls[0]
    // The already-colored string should be passed through without additional coloring
    expect(callArgs).toContain(coloredStr)
    spy.mockRestore()
  })

  it('should satisfy the Logger interface', () => {
    const log: Logger = createLogger('typed')
    expect(log).toBeDefined()
  })
})
