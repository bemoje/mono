import { DefaultMap } from 'mnemonist'
import { defineLazyProperty, hasProperty } from '@mono/object'
import type { FunctionPrototype } from '@mono/types'
import { ParentingTarget, ParentingTargetConstructor } from './types'
import { ParentRelationTypes } from './ParentRelationTypes'
import { View } from '../View'

/**
 * Class that handles the parent-child relationships between objects on their behalf.
 *
 * In order to avoid circular references, all children keep a weak reference to their parent. However,
 * it is not guaranteed. Two objects could in principle mutually be both each other's parent and child
 * at the same time which would allow circular references to exist.
 */
export class Parenting<TP extends object | null = object | null> extends View<ParentingTarget<TP>> {
  /**
   * Class decorator to register and correctly initialize a class as a 'parentingTarget'.
   */
  static compose(cls: ParentingTargetConstructor) {
    // static
    if (!hasProperty(cls, 'parenting')) {
      defineLazyProperty(cls, 'parenting', function <
        P extends object | null,
      >(this: ParentingTargetConstructor<P>) {
        return new ParentRelationTypes(this)
      })
    }

    // prototype
    if (!hasProperty(cls.prototype, 'parenting')) {
      defineLazyProperty(cls.prototype, 'parenting', function <
        P extends object | null = object | null,
      >(this: ParentingTarget<P>) {
        return new Parenting(this)
      })
    }
  }

  /**
   * Store a weak refences to the target object's parent.
   */
  onInstance(parent: TP | null) {
    if (!parent) return
    const targetClass = this.parentingTargetConstructor
    Parenting.parentWeakRefMap.get(targetClass).set(this.target, parent)
    targetClass.parenting?.registerParent(parent.constructor)
  }

  /**
   * Retrieve the parent object of 'target' object.
   */
  getParent(): TP {
    const map = Parenting.parentWeakRefMap.get(this.parentingTargetConstructor)!
    const parent = map.get(this.target)!
    return parent as TP
  }

  /**
   * Recursively get parent until no parent is found or a circular reference is detected.
   */
  *iterateAncestors<T extends object | null = object | null>(): Generator<ParentingTarget<T>> {
    let node = this.target.parenting.getParent()
    if (!node) return
    const seen = new Set<object>()
    while (node) {
      if (seen.has(node)) return
      seen.add(node)
      yield node as ParentingTarget<T>
      node = (node as ParentingTarget<TP>)?.parenting?.getParent()
    }
  }

  /**
   * The depth of the object in the parent-child hierarchy.
   */
  get depth(): number {
    return [...this.iterateAncestors()].length
  }

  /**
   * The class constructor of the target object.
   */
  get parentingTargetConstructor(): ParentingTargetConstructor {
    return this.target.constructor as ParentingTargetConstructor
  }

  /**
   * A WeakMap for parent references.
   */
  private static readonly parentWeakRefMap = new DefaultMap<
    FunctionPrototype,
    WeakMap<ParentingTarget, object | null>
  >(() => new WeakMap<ParentingTarget, object | null>())
}
