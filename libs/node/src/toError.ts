/**
 * Converts the given value to an Error object.
 * If the value is already an Error object, it is returned as is.
 * If the value is not an Error object, it is converted to a string and used as the error message.
 */
export function toError<Err extends Error>(error: Err | unknown): Error {
  return error instanceof Error ? (error as Err) : new Error(String(error || 'Unknown error occurred.'))
}
