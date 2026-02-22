import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import type { AnyConstructor } from '@mono/types'
import type { FunctionPrototype } from '@mono/types'
import { MethodTargetType } from './types'

/**
 * Identifies methods on class prototypes for profiling purposes.
 */
export class PrototypeMethodIdentifier extends AbstractMethodIdentifier<{
  constructor: FunctionPrototype | AnyConstructor
}> {
  override get targetType(): MethodTargetType {
    return 'prototype'
  }
  override get parentName(): string {
    return this.target.constructor.name + '.' + this.targetType
  }
}
