import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import readline from 'readline'
import { confirmPrompt } from './confirmPrompt'

// Mock readline module
vi.mock('readline', () => ({
  default: {
    createInterface: vi.fn(),
  },
}))

const mockedReadline = vi.mocked(readline)

describe(confirmPrompt.name, () => {
  let mockRl: {
    question: ReturnType<typeof vi.fn>
    close: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockRl = {
      question: vi.fn(),
      close: vi.fn(),
    }
    mockedReadline.createInterface.mockReturnValue(mockRl as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('examples', async () => {
    // Mock user input 'y' for yes
    mockRl.question.mockImplementationOnce((message, callback) => {
      callback('y')
    })

    const result = await confirmPrompt('Do you want to continue?')
    assert.strictEqual(result, true, 'should return true for "y" input')

    // Mock user input 'n' for no
    mockRl.question.mockImplementationOnce((message, callback) => {
      callback('n')
    })

    const result2 = await confirmPrompt('Are you sure?')
    assert.strictEqual(result2, false, 'should return false for "n" input')
  })

  describe('readline interface setup', () => {
    it('should create readline interface with correct options', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      await confirmPrompt('Test message')

      expect(mockedReadline.createInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      })
    })

    it('should close readline interface after getting answer', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      await confirmPrompt('Test message')

      expect(mockRl.close).toHaveBeenCalledTimes(1)
    })
  })

  describe('prompt message formatting', () => {
    it('should format prompt message with (y/n) suffix', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      await confirmPrompt('Delete all files?')

      expect(mockRl.question).toHaveBeenCalledWith('Delete all files? (y/n): ', expect.any(Function))
    })

    it('should handle empty message', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('n')
      })

      await confirmPrompt('')

      expect(mockRl.question).toHaveBeenCalledWith(' (y/n): ', expect.any(Function))
    })
  })

  describe('user input handling', () => {
    it('should return true for "y" input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(true)
    })

    it('should return true for "Y" input (uppercase)', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('Y')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(true)
    })

    it('should return false for "n" input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('n')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for "N" input (uppercase)', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('N')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for "no" input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('no')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for "yes" input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('yes')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for empty input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for whitespace input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('   ')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for invalid input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('maybe')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })

    it('should return false for numeric input', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('1')
      })

      const result = await confirmPrompt('Continue?')
      expect(result).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle multiple consecutive prompts', async () => {
      mockRl.question
        .mockImplementationOnce((message, callback) => callback('y'))
        .mockImplementationOnce((message, callback) => callback('n'))
        .mockImplementationOnce((message, callback) => callback('Y'))

      const result1 = await confirmPrompt('First question?')
      const result2 = await confirmPrompt('Second question?')
      const result3 = await confirmPrompt('Third question?')

      expect(result1).toBe(true)
      expect(result2).toBe(false)
      expect(result3).toBe(true)
      expect(mockRl.close).toHaveBeenCalledTimes(3)
    })

    it('should handle special characters in message', async () => {
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      await confirmPrompt('Delete file "test.txt" with símböls & émojis 🚀?')

      expect(mockRl.question).toHaveBeenCalledWith(
        'Delete file "test.txt" with símböls & émojis 🚀? (y/n): ',
        expect.any(Function),
      )
    })

    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(1000)
      mockRl.question.mockImplementationOnce((message, callback) => {
        callback('y')
      })

      const result = await confirmPrompt(longMessage)

      expect(result).toBe(true)
      expect(mockRl.question).toHaveBeenCalledWith(`${longMessage} (y/n): `, expect.any(Function))
    })
  })
})
