import { getClassChain } from './getClassChain'
import type { AnyConstructor } from '@mono/types'

/**
 * Get the immediate superclass of a target.
 * Returns Object if no meaningful superclass exists.
 */
export function getSuperClass(target: object | AnyConstructor): AnyConstructor {
  const chain = getClassChain(target, { includeSelf: false })
  return chain[0] || Object
}
