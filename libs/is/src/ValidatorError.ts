import type { Validator } from '@mono/types'

/**
 * Custom error class for validation failures, providing detailed information about the input, expected outcome, and cause of failure.
 */
export class ValidatorError<T extends Validator> extends Error {
  /**
   * The input value that failed validation.
   */
  input?: Parameters<T>[0]

  /**
   * Indicates whether the validation was expected to pass (i.e., not negated).
   */
  expected: boolean

  /**
   * An object containing details about the cause of validation failure, where keys are validator names or indices and values are the actual results that led to failure.
   */
  cause?: Record<string, string | boolean>

  constructor(
    message: string,
    data?: { input?: Parameters<T>[0]; negate?: boolean; cause?: Record<string, string | boolean> },
  ) {
    super(message)
    this.name = 'ValidationError'
    this.input = data?.input
    this.expected = !data?.negate
    this.cause = data?.cause
    Object.defineProperty(this, 'name', { enumerable: true })
  }
}
