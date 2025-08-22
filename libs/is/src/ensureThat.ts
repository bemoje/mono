import { Any } from '@mono/types'

/**
 * Ensures a value meets validation criteria, throwing an error if it doesn't.
 */
export function ensureThat<T, V extends T | unknown>(
  value: V,
  validator: TValidator<T, V>,
  options: { Err?: new (...args: any[]) => Any; args?: Any[]; is?: boolean } = {},
) {
  const result = validator(value, ...(options.args ?? []))

  if (!(result instanceof Promise)) {
    return handleResult(value, validator, options, result)
  }

  return new Promise((resolve, reject) => {
    result
      .then((r) => {
        resolve(handleResult(value, validator, options, r))
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function handleResult<T, V extends T | unknown>(
  value: V,
  validator: TSyncValidator<T, V> | TAsyncValidator<T, V>,
  options: { Err?: new (...args: any[]) => Any; args?: Any[]; is?: boolean },
  result: string | boolean,
): T {
  const expected = options.is ?? true
  if (result === expected) return value as unknown as T

  const ErrorConstructor = options.Err ?? Error
  throw new ErrorConstructor(
    typeof result === 'string' //
      ? `${result}. Got: ${value}`
      : `Expected '${validator.name}'. Got: ${value}`,
  )
}

export type TValidator<T, V extends T | unknown> = TSyncValidator<T, V> | TAsyncValidator<T, V>

export type TSyncValidator<T, V extends T | unknown> =
  | ((value: V, ...args: any[]) => boolean)
  | ((value: T | unknown, ...args: any[]) => value is T)
  | ((value: V, ...args: any[]) => boolean | string)
  | ((value: V, ...args: any[]) => true | string)

export type TAsyncValidator<T, V extends T | unknown> =
  | ((value: V, ...args: any[]) => Promise<boolean>)
  | ((value: V, ...args: any[]) => Promise<boolean | string>)
  | ((value: V, ...args: any[]) => Promise<true | string>)
