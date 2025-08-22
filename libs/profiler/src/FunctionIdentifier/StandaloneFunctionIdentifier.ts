import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import type { FunctionPrototype } from '@mono/types'
import { FunctionType, TargetType } from './types'

/**
 * Identifies standalone functions for profiling purposes.
 */
export class StandaloneFunctionIdentifier extends AbstractFunctionIdentifier<FunctionPrototype> {
  override get targetType(): TargetType {
    return 'standalone'
  }
  override get type(): FunctionType {
    return 'function'
  }
  override get name(): string {
    return this.target.name + '()'
  }
}
