import { AbstractMethodIdentifier } from './AbstractMethodIdentifier'
import { MethodTargetType, MethodType } from './types'
import { setNonEnumerable } from '@mono/object'

/**
 * Identifies methods within module objects for profiling purposes.
 */
export class ModuleMethodIdentifier extends AbstractMethodIdentifier<object> {
  constructor(
    readonly parentName: string,
    target: object,
    key: string | symbol,
    type: MethodType = 'method',
  ) {
    super(target, key, type)
    setNonEnumerable(this, 'parentName')
  }
  override get targetType(): MethodTargetType {
    return 'module'
  }
}
