import { isPromise } from "es-toolkit/predicate";
import { isString } from "es-toolkit/predicate";
import type { Validator } from "@mono/types";
import type { ValidatorResult } from "@mono/types";
import { ValidatorError } from './ValidatorError'

/**
 * Validates a value using the provided sync or async validator function(s).
 * If validation fails, an error is thrown with details about the failure.
 * Validators can return strings indicating the reason for failure, which will be included in the error message.
 *
 * @param value - The value to be validated.
 * @param validator - A single validator function or an array of validator functions to validate the value against.
 * @param options - Optional settings for validation, including negation and custom error handling.
 * @returns The original value if validation is successful; otherwise, an error is thrown.
 * @throws {ValidatorError} if validation fails, containing details about the input, expected outcome, and cause of failure.
 *
 * @example
 * ```ts
 * ensureThat(42, Number.isInteger)
 * //=> 42
 * ensureThat(-3.142, [Number.isInteger, (n) => n > 0 ? true : 'Must be positive'])
 * // => throws ValidationError { cause: { isInteger: false, [1]: false } }
 * ```
 */
export function ensureThat<T extends Validator, V extends Parameters<T>[0]>(
  value: V,
  validator: T | T[],
  options?: { message?: string; negate?: boolean },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> extends ReturnType<T> ? Promise<V> : V {
  const validators = [validator].flat(2) as T[]
  const retvals = validators.map((v) => v(value))
  const isAsync = retvals.some(isPromise)

  if (isAsync) {
    return Promise.all(retvals.map(async (r) => await r)).then((awaited) => {
      return handleResult(validators, awaited, value, options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as Promise<any> extends ReturnType<T> ? Promise<V> : V
  } else {
    return handleResult(validators, retvals as ValidatorResult[], value, options)
  }
}

function handleResult<T extends Validator, V extends Parameters<T>[0]>(
  validators: T[],
  retvals: ValidatorResult[],
  value: V,
  opts?: { message?: string; negate?: boolean },
) {
  const negate = !!opts?.negate
  const expected = !negate
  const causeEntries = validators
    .map((validator, i) => {
      const retval = retvals[i]
      const actual = isString(retval) ? false : !!retval
      const valid = actual === expected
      if (!valid) {
        const res = isString(retval) ? retval.trim() : actual
        const name = validator.name
        return [name || '[' + i + ']', res]
      }
    })
    .filter((v): v is [string, string] => !!v)

  if (!causeEntries.length) {
    return value as Parameters<T>[0]
  }

  const message =
    opts?.message?.trim() ||
    [
      `Expected [${validators.map((o, i) => o.name || `[${i}]`).join(', ')}]`,
      `to return '${expected}'`,
      `for input: '${String(value).slice(0, 30)}'`,
    ]
      .filter(Boolean)
      .join(' ')

  throw new ValidatorError(message, {
    input: value,
    negate: negate,
    cause: Object.fromEntries(causeEntries),
  })
}
