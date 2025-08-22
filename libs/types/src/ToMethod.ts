import { Tail } from './Tail'

/**
 * Converts a function to a method by making the 'this' context the first argument.
 *
 * @example ```ts
 * type example = ToMethod<(instance:RegExp, arg1:string) => number>
 * //=> type example = (this: RegExp, arg1: string) => number
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToMethod<F extends (...args: any[]) => any> = (
  this: Parameters<F>[0],
  ...args: Tail<Parameters<F>>
) => ReturnType<F>
