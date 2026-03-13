import type { AnyConstructor } from '@mono/types'
import { getClassChain } from './getClassChain'

/**
 * Get all superclasses of a target (excluding the target itself by default).
 * Simpler version without overloads - just returns the class chain.
 */
export function getSuperClasses(
  target: object | AnyConstructor,
  options?: { includeSelf?: boolean }
): AnyConstructor[] {
  return getClassChain(target, { includeSelf: options?.includeSelf ?? false })
}
