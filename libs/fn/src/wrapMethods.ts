import type { AnyGetter } from '@mono/types'
import type { AnyFunction } from '@mono/types'
import type { AnySetter } from '@mono/types'
import { defineGetter, defineMethod, defineSetter } from '@mono/object'
import { isFunction } from 'lodash-es'
import { preserveNameAndLength } from './preserveNameAndLength'

/**
 * Wrap methods, getters and setters of an object with custom logic.
 */
export function wrapMethods<T extends object>(target: T, strat: WrapMethodsStrategy<T>) {
  for (const [key, type, des] of iterateMethods(target)) {
    if (strat.filter && !strat.filter(target, key, type, des)) {
      continue
    }
    if (type === 'method') {
      if (!strat.onMethod) continue
      const orig = des.value!
      const wrapped = strat.onMethod(target, key, orig)
      if (!wrapped) continue
      defineMethod(target, key, preserveNameAndLength(orig, wrapped))
    } else if (type === 'get') {
      if (!strat.onGetter) continue
      const orig = des.get!
      const wrapped = strat.onGetter(target, key, orig)
      if (!wrapped) continue
      defineGetter(target, key, preserveNameAndLength(orig, wrapped))
    } else if (type === 'set') {
      if (!strat.onSetter) continue
      const orig = des.set!
      const wrapped = strat.onSetter(target, key, orig)
      if (!wrapped) continue
      defineSetter(target, key, preserveNameAndLength(orig, wrapped))
    }
  }
  return target
}

function* iterateMethods<T extends object>(
  target: T,
): Generator<[string | symbol, DescriptorMethodType, PropertyDescriptor]> {
  for (const key of Reflect.ownKeys(target)) {
    const des = Object.getOwnPropertyDescriptor(target, key)
    if (!des || des.configurable === false) continue
    if (isFunction(des.value)) {
      yield [key, 'method', des]
    } else {
      if (isFunction(des.get)) yield [key, 'get', des]
      if (isFunction(des.set)) yield [key, 'set', des]
    }
  }
}

export type DescriptorMethodType = 'get' | 'set' | 'method'

export type MethodFilter<T extends object = object> = (
  target: T,
  key: string | symbol,
  type: DescriptorMethodType,
  descriptor: PropertyDescriptor,
) => boolean

export type MethodWrapper<T extends object = object> = (
  target: T,
  key: string | symbol,
  method: AnyFunction,
) => AnyFunction | undefined

export type GetterWrapper<T extends object = object> = (
  target: T,
  key: string | symbol,
  getter: AnyGetter,
) => AnyGetter | undefined

export type SetterWrapper<T extends object = object> = (
  target: T,
  key: string | symbol,
  setter: AnySetter,
) => AnySetter | undefined

export interface WrapMethodsStrategy<T extends object = object> {
  filter?: MethodFilter<T>
  onGetter?: GetterWrapper<T>
  onSetter?: SetterWrapper<T>
  onMethod?: MethodWrapper<T>
}
