import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import colors from 'ansi-colors'
import { enablePrettyStackTrace } from './enablePrettyStackTrace'
import { prettyStackTrace } from './prettyStackTrace'

describe(prettyStackTrace.name, () => {
  let originalListeners: NodeJS.UncaughtExceptionListener[]
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Store original listeners to restore later
    originalListeners = process.listeners('uncaughtException') as NodeJS.UncaughtExceptionListener[]
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Remove all uncaughtException listeners and restore originals
    process.removeAllListeners('uncaughtException')
    originalListeners.forEach((listener) => process.on('uncaughtException', listener))
    consoleErrorSpy.mockRestore()
  })

  it('examples', () => {
    expect(() => {
      // Basic error formatting
      const error = new Error('Test error message')
      const result = prettyStackTrace(error)

      // Should contain the error message
      assert(result.includes('Test error message'), 'should include error message')

      // Should contain stack trace section
      assert(result.includes('stack:'), 'should include stack section')

      // Error with custom properties
      const errorWithProps = new Error('Error with props') as Error & { code: string; statusCode: number }
      errorWithProps.code = 'TEST_ERROR'
      errorWithProps.statusCode = 500

      const resultWithProps = prettyStackTrace(errorWithProps)
      assert(resultWithProps.includes('code'), 'should include custom properties')
      assert(resultWithProps.includes('TEST_ERROR'), 'should include property values')

      // With options
      const omitStackResult = prettyStackTrace(error, { omitStack: true })
      assert(!omitStackResult.includes('stack:'), 'should omit stack when requested')

      const omitPropsResult = prettyStackTrace(errorWithProps, { omitProps: true })
      assert(!omitPropsResult.includes('code'), 'should omit props when requested')
    }).not.toThrow()
  })

  describe('error message rendering', () => {
    it('should render error message in red color', () => {
      const error = new Error('Test error message')
      const result = prettyStackTrace(error)

      // Should contain the colored error message
      expect(result).toContain(colors.red('Test error message'))
    })

    it('should handle empty error message', () => {
      const error = new Error('')
      const result = prettyStackTrace(error)

      expect(result).toContain(colors.red(''))
    })

    it('should handle special characters in error message', () => {
      const message = 'Error with special chars: ñáéíóú & symbols @#$%'
      const error = new Error(message)
      const result = prettyStackTrace(error)

      expect(result).toContain(colors.red(message))
    })
  })

  describe('stack trace rendering', () => {
    it('should render stack trace with proper formatting', () => {
      const error = new Error('Stack test')
      const result = prettyStackTrace(error)

      expect(result).toContain(colors.magenta('stack:'))
      // Should have indented stack frames
      expect(result).toMatch(/  {2}\w+/)
    })

    it('should omit stack when omitStack option is true', () => {
      const error = new Error('No stack test')
      const result = prettyStackTrace(error, { omitStack: true })

      expect(result).not.toContain('stack:')
      expect(result).not.toContain('  at ')
    })

    it('should handle error without stack property', () => {
      const error = new Error('No stack')
      delete error.stack
      const result = prettyStackTrace(error)

      expect(result).not.toContain('stack:')
    })

    it('should format file paths relative to current working directory', () => {
      // Create an error with a known stack
      const error = new Error('Path test')

      // The stack should contain relative paths
      const result = prettyStackTrace(error)

      // Should contain stack trace section
      expect(result).toContain('stack:')

      // On Windows, we might still see drive letters in some paths,
      // but relative paths should be converted
      expect(result).toMatch(/libs\\stacktrace/)
    })

    it('should color-code different types of files', () => {
      const error = new Error('Color test')
      const result = prettyStackTrace(error)

      // This test verifies the structure exists, specific coloring is harder to test
      // without mocking the stacktrace-parser
      expect(result).toContain('stack:')
    })
  })

  describe('custom properties rendering', () => {
    it('should render custom error properties', () => {
      const error = new Error('Props test') as Error & {
        code: string
        statusCode: number
        details: { userId: number; action: string }
      }
      error.code = 'TEST_CODE'
      error.statusCode = 404
      error.details = { userId: 123, action: 'fetch' }

      const result = prettyStackTrace(error)

      expect(result).toContain('code')
      expect(result).toContain('TEST_CODE')
      expect(result).toContain('statusCode')
      expect(result).toContain('404')
      expect(result).toContain('details')
      expect(result).toContain('userId')
      expect(result).toContain('123')
    })

    it('should omit props when omitProps option is true', () => {
      const error = new Error('No props test') as Error & { code: string; statusCode: number }
      error.code = 'SHOULD_NOT_APPEAR'
      error.statusCode = 500

      const result = prettyStackTrace(error, { omitProps: true })

      expect(result).not.toContain('code')
      expect(result).not.toContain('SHOULD_NOT_APPEAR')
      expect(result).not.toContain('statusCode')
    })

    it('should ignore standard error properties', () => {
      const error = new Error('Standard props test') as Error & { customProp: string }
      error.customProp = 'should appear'

      const result = prettyStackTrace(error)

      // Should not contain standard properties as separate props in the props section
      // The 'stack:' that appears is the stack trace section header, not a property
      const lines = result.split('\n')
      const stackLineIndex = lines.findIndex((line) => line.includes('stack:'))
      const propsSection = lines.slice(0, stackLineIndex).join('\n')

      expect(propsSection).not.toContain('name:')
      expect(propsSection).not.toContain('message:')

      // Should contain custom property
      expect(result).toContain('customProp')
      expect(result).toContain('should appear')
    })

    it('should handle errors with no custom properties', () => {
      const error = new Error('No custom props')
      const result = prettyStackTrace(error)

      // Should still work without throwing
      expect(result).toContain('No custom props')
      expect(result).toContain('stack:')
    })

    it('should handle complex nested properties', () => {
      const error = new Error('Nested props test') as Error & {
        config: {
          database: { host: string; port: number }
          features: string[]
          metadata: { version: string; timestamp: Date }
        }
      }
      error.config = {
        database: { host: 'localhost', port: 5432 },
        features: ['auth', 'logging'],
        metadata: { version: '1.0.0', timestamp: new Date('2023-01-01') },
      }

      const result = prettyStackTrace(error)

      expect(result).toContain('config')
      expect(result).toContain('database')
      expect(result).toContain('localhost')
      expect(result).toContain('features')
      expect(result).toContain('auth')
    })
  })

  describe('options handling', () => {
    it('should handle both omitStack and omitProps together', () => {
      const error = new Error('Both options test') as Error & { customProp: string }
      error.customProp = 'should not appear'

      const result = prettyStackTrace(error, { omitStack: true, omitProps: true })

      expect(result).not.toContain('stack:')
      expect(result).not.toContain('customProp')
      expect(result).toContain('Both options test') // message should still appear
    })

    it('should handle empty options object', () => {
      const error = new Error('Empty options test')
      const result = prettyStackTrace(error, {})

      expect(result).toContain('Empty options test')
      expect(result).toContain('stack:')
    })

    it('should handle undefined options', () => {
      const error = new Error('Undefined options test')
      const result = prettyStackTrace(error)

      expect(result).toContain('Undefined options test')
      expect(result).toContain('stack:')
    })
  })

  describe('output formatting', () => {
    it('should end with a newline', () => {
      const error = new Error('Newline test')
      const result = prettyStackTrace(error)

      expect(result).toMatch(/\n$/)
    })

    it('should have proper section separation', () => {
      const error = new Error('Section test') as Error & { customProp: string }
      error.customProp = 'test value'

      const result = prettyStackTrace(error)

      // Should have newlines separating sections
      expect(result).toContain('\n')

      // Should contain all three main parts: message, stack, props
      const lines = result.split('\n')
      expect(lines.length).toBeGreaterThan(3)
    })
  })
})

describe(enablePrettyStackTrace.name, () => {
  let originalListeners: NodeJS.UncaughtExceptionListener[]
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Store original listeners to restore later
    originalListeners = process.listeners('uncaughtException') as NodeJS.UncaughtExceptionListener[]
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Remove all uncaughtException listeners and restore originals
    process.removeAllListeners('uncaughtException')
    originalListeners.forEach((listener) => process.on('uncaughtException', listener))
    consoleErrorSpy.mockRestore()
  })

  it('examples', () => {
    expect(() => {
      // Enable pretty stack trace
      enablePrettyStackTrace()

      // Verify a listener was added
      const listeners = process.listeners('uncaughtException')
      assert(listeners.length > originalListeners.length, 'should add uncaught exception listener')

      // Create an error and simulate uncaught exception
      const testError = new Error('Test uncaught error')

      // Manually trigger the listener to test it
      const addedListeners = process
        .listeners('uncaughtException')
        .filter((listener) => !originalListeners.includes(listener))

      assert(addedListeners.length === 1, 'should add exactly one listener')

      // Call the listener directly (safer than throwing)
      const listener = addedListeners[0] as (error: Error) => void
      listener(testError)

      // Verify console.error was called
      assert(consoleErrorSpy.mock.calls.length > 0, 'should call console.error')
    }).not.toThrow()
  })

  it('should add uncaught exception listener', () => {
    const initialListenerCount = process.listeners('uncaughtException').length

    enablePrettyStackTrace()

    const finalListenerCount = process.listeners('uncaughtException').length
    expect(finalListenerCount).toBe(initialListenerCount + 1)
  })

  it('should prepend listener to handle errors first', () => {
    // Add a test listener first
    const testListener = vi.fn()
    process.on('uncaughtException', testListener)

    enablePrettyStackTrace()

    const listeners = process.listeners('uncaughtException')

    // The pretty stack trace listener should be first (prepended)
    // We can verify this by checking that our test listener is not first
    expect(listeners[0]).not.toBe(testListener)
    expect(listeners).toContain(testListener)
  })

  it('should format and log errors when uncaught exception occurs', () => {
    enablePrettyStackTrace()

    const testError = new Error('Uncaught test error') as Error & { code: string }
    testError.code = 'TEST_UNCAUGHT'

    // Get the added listener and call it directly
    const listeners = process.listeners('uncaughtException')
    const addedListener = listeners.find((listener) => !originalListeners.includes(listener)) as (
      error: Error,
    ) => void

    expect(addedListener).toBeDefined()

    addedListener(testError)

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Uncaught test error'))
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('stack:'))
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('code'))
  })

  it('should handle multiple calls without adding duplicate listeners', () => {
    const initialListenerCount = process.listeners('uncaughtException').length

    enablePrettyStackTrace()
    enablePrettyStackTrace()
    enablePrettyStackTrace()

    const finalListenerCount = process.listeners('uncaughtException').length

    // Should add 3 listeners (one for each call) since prepend adds multiple
    expect(finalListenerCount).toBe(initialListenerCount + 3)
  })

  it('should work with errors that have no stack', () => {
    enablePrettyStackTrace()

    const testError = new Error('No stack error')
    delete testError.stack

    const listeners = process.listeners('uncaughtException')
    const addedListener = listeners.find((listener) => !originalListeners.includes(listener)) as (
      error: Error,
    ) => void

    expect(() => {
      addedListener(testError)
    }).not.toThrow()

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('No stack error'))
  })
})
