import { Class } from 'type-fest'
import { IView } from './IView'

/**
 * Inherits a single prototype property from a target class to a viewer class with proxification.
 */
export function inheritProxifiedPrototypeProperty<Viewer extends IView<Target>, Target extends object>(
  ViewerClass: Class<Viewer>,
  TargetClass: Class<Target>,
  key: keyof Target,
) {
  const des = Reflect.getOwnPropertyDescriptor(TargetClass.prototype, key)
  if (!des) return

  if (des.value && typeof des.value === 'function') {
    return Object.defineProperty(ViewerClass.prototype, key, {
      value(...args: any[]) {
        return this.target[key](...args)
      },
      writable: true,
      configurable: true,
      enumerable: false,
    })
  } else if (des && !des.get && !des.set) {
    return Object.defineProperty(ViewerClass.prototype, key, {
      get(this: Viewer) {
        return this.target[key]
      },
      set: des.writable
        ? function set(this: Viewer, value: Target[keyof Target]) {
            this.target[key] = value
          }
        : undefined,
      configurable: true,
      enumerable: false,
    })
  } else {
    Object.defineProperty(ViewerClass.prototype, key, {
      get: des.get
        ? function (this: Viewer) {
            return this.target[key]
          }
        : undefined,
      set: des.set
        ? function (this: Viewer, value: Target[typeof key]) {
            this.target[key] = value
          }
        : undefined,
      configurable: true,
      enumerable: false,
    })
  }
}
