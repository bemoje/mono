import { describe, expect, it, vi } from 'vitest'
import { timer } from './timer'

describe(timer.name, () => {
  it('should execute a synchronous task and return the result', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const result = timer('sync-task', () => 42)
    expect(result).toBe(42)
    vi.restoreAllMocks()
  })

  it('should execute an async task and return the result', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const result = await timer('async-task', async () => 'hello')
    expect(result).toBe('hello')
    vi.restoreAllMocks()
  })

  it('should pass the logger and name to the task callback', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    timer('my-task', (log, name) => {
      expect(name).toBe('my-task')
      expect(log).toHaveProperty('start')
      expect(log).toHaveProperty('done')
      expect(log).toHaveProperty('info')
      expect(log).toHaveProperty('warn')
      expect(log).toHaveProperty('error')
    })
    vi.restoreAllMocks()
  })

  it('should accept a [name, description] tuple', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    timer(['build', 'Building the project'], (log, name) => {
      expect(name).toBe('build')
    })
    // log.start should have been called with the description
    expect(spy).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('should call log.start when name is provided', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    timer('named-task', () => {})
    // start + done = at least 2 calls
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2)
    vi.restoreAllMocks()
  })

  it('should call log.done after the task completes', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    timer('done-task', () => 'result')
    // The last console.info call should be from log.done
    expect(spy).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('should call log.done after async task resolves', async () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    await timer('async-done', async () => 'async-result')
    expect(spy).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('should not call log.start when name is empty string', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    timer('', () => 'no-name')
    // Only log.done should be called, not log.start
    expect(spy.mock.calls.length).toBe(1)
    vi.restoreAllMocks()
  })

  it('should return the exact value from a synchronous task', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const obj = { a: 1, b: [2, 3] }
    const result = timer('obj-task', () => obj)
    expect(result).toBe(obj)
    vi.restoreAllMocks()
  })

  it('should return the exact value from an async task', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const obj = { a: 1, b: [2, 3] }
    const result = await timer('async-obj', async () => obj)
    expect(result).toBe(obj)
    vi.restoreAllMocks()
  })
})
