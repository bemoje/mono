import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { prompt } from './prompt'

const { mockCreateInterface } = vi.hoisted(() => {
  return {
    mockCreateInterface: vi.fn(),
  }
})

// Mock readline
vi.mock('readline', async () => {
  return {
    default: {
      createInterface: mockCreateInterface,
    },
    createInterface: mockCreateInterface,
  }
})

describe(prompt.name, () => {
  let mockRl: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockRl = {
      question: vi.fn(),
      close: vi.fn(),
    }

    mockCreateInterface.mockReturnValue(mockRl)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('examples', async () => {
    expect(() => {
      // Basic prompt without callback
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('user input')
      })

      const result = prompt('What is your name?')
      assert(result instanceof Promise, 'should return promise')

      // Prompt with validation callback
      const resultWithCallback = prompt('Enter age:', (input) => {
        const age = parseInt(input)
        return age > 0 ? input : ''
      })
      assert(resultWithCallback instanceof Promise, 'should handle validation callback')
    }).not.toThrow()
  })

  describe('basic functionality', () => {
    it('should prompt user and return input', async () => {
      const userInput = 'Hello World'

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(userInput)
      })

      const result = await prompt('Enter something:')

      expect(result).toBe(userInput)
      expect(mockRl.question).toHaveBeenCalledWith('Enter something:', expect.any(Function))
      expect(mockRl.close).toHaveBeenCalled()
      expect(mockCreateInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      })
    })

    it('should trim user input', async () => {
      const userInput = '  trimmed input  '

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(userInput)
      })

      const result = await prompt('Enter something:')

      expect(result).toBe('trimmed input')
    })

    it('should handle empty input without callback', async () => {
      let callCount = 0

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        if (callCount === 1) {
          callback('') // First call returns empty
        } else {
          callback('valid input') // Second call returns valid input
        }
      })

      const result = await prompt('Enter something:')

      expect(result).toBe('valid input')
      expect(mockRl.question).toHaveBeenCalledTimes(2)
    })

    it('should handle whitespace-only input without callback', async () => {
      let callCount = 0

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        if (callCount === 1) {
          callback('   ') // First call returns whitespace only
        } else {
          callback('valid input') // Second call returns valid input
        }
      })

      const result = await prompt('Enter something:')

      expect(result).toBe('valid input')
      expect(mockRl.question).toHaveBeenCalledTimes(2)
    })
  })

  describe('callback validation', () => {
    it('should use callback to validate input', async () => {
      const validationCallback = vi
        .fn()
        .mockReturnValueOnce('') // First call fails validation
        .mockReturnValueOnce('validated input') // Second call passes

      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        callback(callCount === 1 ? 'invalid' : 'valid')
      })

      const result = await prompt('Enter something:', validationCallback)

      expect(result).toBe('validated input')
      expect(validationCallback).toHaveBeenCalledTimes(2)
      expect(validationCallback).toHaveBeenNthCalledWith(1, 'invalid')
      expect(validationCallback).toHaveBeenNthCalledWith(2, 'valid')
      expect(mockRl.question).toHaveBeenCalledTimes(2)
    })

    it('should re-prompt when callback returns empty string', async () => {
      const validationCallback = vi
        .fn()
        .mockReturnValueOnce('') // Fail first time
        .mockReturnValueOnce('') // Fail second time
        .mockReturnValueOnce('success') // Pass third time

      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        callback(`input${callCount}`)
      })

      const result = await prompt('Enter valid input:', validationCallback)

      expect(result).toBe('success')
      expect(validationCallback).toHaveBeenCalledTimes(3)
      expect(mockRl.question).toHaveBeenCalledTimes(3)
    })

    it('should pass trimmed input to callback', async () => {
      const validationCallback = vi.fn().mockReturnValue('processed')

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('  input with spaces  ')
      })

      await prompt('Enter something:', validationCallback)

      expect(validationCallback).toHaveBeenCalledWith('input with spaces')
    })

    it('should return callback result when non-empty', async () => {
      const validationCallback = vi.fn().mockReturnValue('transformed input')

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('original input')
      })

      const result = await prompt('Enter something:', validationCallback)

      expect(result).toBe('transformed input')
    })
  })

  describe('readline interface management', () => {
    it('should create readline interface with correct options', async () => {
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('input')
      })

      await prompt('Test question:')

      expect(mockCreateInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      })
    })

    it('should close readline interface after completion', async () => {
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('input')
      })

      await prompt('Test question:')

      expect(mockRl.close).toHaveBeenCalled()
    })

    it('should close readline interface even after multiple prompts', async () => {
      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        callback(callCount === 1 ? '' : 'valid input')
      })

      await prompt('Test question:')

      expect(mockRl.close).toHaveBeenCalledTimes(1)
    })

    it('should reuse same readline interface for multiple question calls', async () => {
      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        callback(callCount === 1 ? '' : 'valid input')
      })

      await prompt('Test question:')

      expect(mockCreateInterface).toHaveBeenCalledTimes(1)
      expect(mockRl.question).toHaveBeenCalledTimes(2)
    })
  })

  describe('edge cases', () => {
    it('should handle very long input', async () => {
      const longInput = 'a'.repeat(10000)

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(longInput)
      })

      const result = await prompt('Enter long text:')

      expect(result).toBe(longInput)
    })

    it('should handle special characters in input', async () => {
      const specialInput = '!@#$%^&*()[]{}|\\:";\'<>?,./'

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(specialInput)
      })

      const result = await prompt('Enter special chars:')

      expect(result).toBe(specialInput)
    })

    it('should handle unicode characters', async () => {
      const unicodeInput = '🚀 Hello 世界 café naïve résumé'

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(unicodeInput)
      })

      const result = await prompt('Enter unicode:')

      expect(result).toBe(unicodeInput)
    })

    it('should handle newlines in input', async () => {
      const inputWithNewlines = 'line1\nline2\nline3'

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback(inputWithNewlines)
      })

      const result = await prompt('Enter multiline:')

      expect(result).toBe(inputWithNewlines)
    })

    it('should handle empty question string', async () => {
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('response')
      })

      const result = await prompt('')

      expect(result).toBe('response')
      expect(mockRl.question).toHaveBeenCalledWith('', expect.any(Function))
    })
  })

  describe('complex validation scenarios', () => {
    it('should handle validation that transforms input', async () => {
      const upperCaseValidator = (input: string) => {
        return input.length > 0 ? input.toUpperCase() : ''
      }

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('hello world')
      })

      const result = await prompt('Enter text:', upperCaseValidator)

      expect(result).toBe('HELLO WORLD')
    })

    it('should handle numeric validation', async () => {
      const numberValidator = (input: string) => {
        const num = parseInt(input)
        if (isNaN(num) || num <= 0) return ''
        return num.toString()
      }

      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        const inputs = ['invalid', '-5', '42']
        callback(inputs[callCount - 1] || '42')
      })

      const result = await prompt('Enter positive number:', numberValidator)

      expect(result).toBe('42')
      expect(mockRl.question).toHaveBeenCalledTimes(3)
    })

    it('should handle email validation example', async () => {
      const emailValidator = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(input) ? input : ''
      }

      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        const inputs = ['invalid-email', 'test@example.com']
        callback(inputs[callCount - 1] || 'test@example.com')
      })

      const result = await prompt('Enter email:', emailValidator)

      expect(result).toBe('test@example.com')
      expect(mockRl.question).toHaveBeenCalledTimes(2)
    })
  })

  describe('async callback behavior', () => {
    it('should handle synchronous callback correctly', async () => {
      const syncCallback = (input: string) => input.trim().toLowerCase()

      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callback('  HELLO WORLD  ')
      })

      const result = await prompt('Enter text:', syncCallback)

      expect(result).toBe('hello world')
    })

    it('should work with callback that always returns empty (infinite loop protection)', async () => {
      const alwaysFailCallback = () => ''

      let callCount = 0
      mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
        callCount++
        if (callCount > 100) {
          // Simulate user finally providing valid input to break infinite loop
          callback('break')
          return
        }
        callback('input')
      })

      // Override the callback after many calls to prevent infinite loop in test
      const wrappedCallback = (input: string) => {
        if (input === 'break') return 'success'
        return alwaysFailCallback()
      }

      const result = await prompt('Enter valid input:', wrappedCallback)
      expect(result).toBe('success')
    })
  })
})
