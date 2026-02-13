import { describe, expect, it, vi } from 'vitest'
import { createLogger, type Logger } from './createLogger'

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

  it('should satisfy the Logger interface', () => {
    const log: Logger = createLogger('typed')
    expect(log).toBeDefined()
  })
})
