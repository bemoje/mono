import type { AnyConstructor } from '@mono/types'
import { isConstructor } from './isConstructor'

/**
 * Checks if the given value is a constructor function using 'class' syntax.
 *
 * WARNING: If the running code is minified or mangled, this function may not work as expected.
 * However, it should be resistant to minification/mangling if the 'class' keyword is present in the first line of the function.
 *
 * @remarks
 * WARNING: The function uses .toString() on the input function object and incorporates the presence of the 'class' keyword being present in the first line of code to determine whether it is a class syntax consturctor.
 *
 */
export function isClass(value: unknown): value is AnyConstructor {
  if (!isConstructor(value)) return false
  const re = /^[\s]*(\w+[\s]+)?class([\s]+\w+)?[\s]*\{/
  if (!re.test(value.toString())) return false
  return true
}
