import type { Class } from 'type-fest'
import type { IView } from './IView'
import { inheritProxifiedPrototypeProperty } from './inheritProxifiedPrototypeProperty'

/**
 * Inherits prototype properties from a target class to a viewer class with proxification, excluding specified keys.
 */
export function inheritProxifiedPrototype<
  Viewer extends IView<Target>,
  Target extends object,
  Omitted extends PropertyKey[] = [],
>(ViewerClass: Class<Viewer>, TargetClass: Class<Target>, omitKeys: Omitted) {
  Reflect.ownKeys(TargetClass.prototype)
    .filter((k) => {
      return k !== 'constructor' && k !== Symbol.toStringTag
    })
    .filter((k) => {
      return omitKeys ? !omitKeys.includes(k) : true
    })
    .forEach((k) => {
      return inheritProxifiedPrototypeProperty(ViewerClass, TargetClass, k as keyof Target)
    })
  return ViewerClass as typeof ViewerClass & { prototype: Viewer & Omit<Target, Omitted[number]> }
}
