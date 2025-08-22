import { FunctionPrototype } from '@mono/types'
import { FunctionType, TargetType } from './types'
import { inspect } from 'util'
import { setNonEnumerable } from '@mono/object'

/**
 * Abstract base class for identifying and naming functions in profiling contexts.
 */
export abstract class AbstractFunctionIdentifier<T extends FunctionPrototype | object> {
  abstract readonly targetType: TargetType
  abstract readonly type: FunctionType
  abstract readonly name: string

  constructor(readonly target: T) {
    setNonEnumerable(this, 'target')
  }

  toJSON() {
    return this.name
  }

  public [inspect.custom]() {
    return this.name
  }
}
