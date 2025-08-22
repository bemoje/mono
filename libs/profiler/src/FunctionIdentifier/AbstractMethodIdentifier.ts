import { AbstractFunctionIdentifier } from './AbstractFunctionIdentifier'
import type { FunctionPrototype } from '@mono/types'
import { isSymbol } from 'lodash-es'
import { MethodTargetType, MethodType } from './types'
import { setNonEnumerable } from '@mono/object'

/**
 * Abstract base class for identifying and naming method functions in profiling contexts.
 */
export abstract class AbstractMethodIdentifier<
  T extends object | FunctionPrototype,
> extends AbstractFunctionIdentifier<T> {
  abstract override readonly targetType: MethodTargetType
  abstract readonly parentName: string | undefined
  constructor(
    target: T,
    readonly key: string | symbol,
    readonly type: MethodType = 'method',
  ) {
    super(target)
    setNonEnumerable(this, 'type', 'key')
  }
  keytoString() {
    return isSymbol(this.key) ? `[${this.key.description}]` : this.key
  }
  get methodName(): string {
    if (this.type === 'method') return this.keytoString() + '()'
    if (this.type === 'get') return this.keytoString()
    return this.keytoString() + '[set]'
  }
  get name(): string {
    return this.parentName + (isSymbol(this.key) ? '' : '.') + this.methodName
  }
}
