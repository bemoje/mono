import { IView } from './IView'

const TARGET_SYMBOL = Symbol('target')

/**
 * Base class providing view functionality over a target object using the Composition pattern.
 */
export class View<Target extends object> implements IView<Target> {
  private [TARGET_SYMBOL]: Target

  constructor(target: Target) {
    this[TARGET_SYMBOL] = target
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get target(): Target {
    return this[TARGET_SYMBOL]
  }
}
