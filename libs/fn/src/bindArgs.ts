import { Any } from '@mono/types'
import { TupleToObject, UnionToTuple } from 'type-fest'
import { RemoveArrayElements } from '@mono/types'
import { range } from 'lodash'
import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Binds specified arguments to the provided function, returning a new function that requires
 * only the remaining arguments at call time.
 *
 * @typeParam T - The type of the function to be invoked with bound and unbound arguments.
 * @typeParam BoundArgs - A partial mapping of indices in `Parameters<T>` to their bound values.
 *
 * @param fn - The original function whose arguments need to be partially applied.
 * @param boundArgs - An object mapping argument indices to their respective bound values.
 *
 * @returns A function that, when invoked, applies both bound and unbound arguments in the correct order.
 */
export function bindArgs<
  T extends (...args: Any[]) => Any,
  BoundArgs extends Partial<TupleToObject<Parameters<T>>>,
>(fn: T, boundArgs: BoundArgs) {
  type NewArgs = RemoveArrayElements<
    Parameters<T>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    UnionToTuple<Extract<keyof BoundArgs, number>>
  >
  const boundIndices = Object.keys(boundArgs).map(Number)
  const lastIndex = Math.max(fn.length - 1, ...boundIndices)
  const indices = range(0, lastIndex + 1)

  let offset = 0
  const argGetters = indices.map((index) => {
    const isBound = Object.hasOwn(boundArgs, index)
    const boundIndex = index as keyof BoundArgs
    const unboundIndex = index - (isBound ? offset++ : offset)
    return isBound
      ? () => boundArgs[boundIndex] //
      : (args: NewArgs) => args[unboundIndex]
  })

  return preserveNameAndLength(
    fn,
    (...args: NewArgs): ReturnType<T> => {
      return fn(...argGetters.map((get) => get(args)))
    },
    boundIndices.length * -1,
  )
}
