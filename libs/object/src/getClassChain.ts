import type { AnyConstructor } from '@mono/types'
import { isConstructor } from '@mono/is'

/**
 * Get the class constructor chain for any target (constructor, prototype, or instance).
 * Always returns constructors/classes, never prototype objects.
 * By default excludes the target's own constructor (returns superclasses only).
 */
export function getClassChain(
  target: object | AnyConstructor,
  options?: { includeSelf?: boolean },
): AnyConstructor[] {
  const ctor = (isConstructor(target) ? target : target.constructor) as AnyConstructor
  const result: AnyConstructor[] = []

  if (options?.includeSelf) {
    result.push(ctor)
  }

  let current: object | null = ctor
  while ((current = Reflect.getPrototypeOf(current))) {
    if (current === Function.prototype || current === Object.prototype) {
      result.push(Object)
      break
    }
    result.push(current as AnyConstructor)
  }

  return result
}
