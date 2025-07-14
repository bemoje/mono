/**
 * A validator function that returns 'true' if VALUE is valid and 'false' if invalid.
 * Additional optional arguments may be passed to the validator function.
 */
export type TValidator<T> = (value: T, ...args: any[]) => boolean
