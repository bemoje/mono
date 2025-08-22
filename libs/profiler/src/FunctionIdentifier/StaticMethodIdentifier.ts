import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import type { AnyConstructor } from '@mono/types'
import type { FunctionPrototype } from '@mono/types'
import { MethodTargetType } from './types'

/**
 * Identifies static methods on classes for profiling purposes.
 */
export class StaticMethodIdentifier extends AbstractMethodIdentifier<FunctionPrototype | AnyConstructor> {
  override get targetType(): MethodTargetType {
    return 'static'
  }
  override get parentName(): string {
    return this.target.name
  }
}
