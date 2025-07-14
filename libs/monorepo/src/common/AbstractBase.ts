import { Inspector, InspectorTarget, Parenting, ParentingTarget } from '@mono/composition'

declare module './AbstractBase' {
  export interface AbstractBase extends InspectorTarget {}
  export interface AbstractBase<P extends object | null> extends ParentingTarget<P> {}
}

/**
 * Abstract base class that provides common functionality for monorepo management including parenting and inspection capabilities.
 */
@Parenting.compose
export abstract class AbstractBase<P extends object | null = object | null> implements ParentingTarget<P> {
  static inspector = Inspector.compose(AbstractBase, {
    keys: [],
    autoAddBooleanKeys: true,
    ignoreKeys: [],
    ignoreValues: {
      noEmptyArray: true,
      noEmptyObject: true,
      noNull: true,
      noUndefined: true,
      noFalse: true,
    },
    inspect: {
      customInspect: true,
      maxStringLength: 500,
      maxArrayLength: 5,
      breakLength: 80,
      colors: true,
      depth: null,
      compact: false,
      numericSeparator: true,
    },
    filters: [],
  })

  constructor(parent: P) {
    this.parenting.onInstance(parent)
  }

  findParentDeep<T extends AbstractBase>(predicate: (parent: T) => boolean): T | undefined {
    for (const parent of this.parenting.iterateAncestors()) {
      if (!parent) continue
      if (predicate(parent as T)) {
        return parent as T
      }
    }
    return undefined
  }

  get parent(): P {
    return this.parenting.getParent()
  }

  getParentDeep<T extends AbstractBase>(instanceOf: new (...args: any[]) => T): T {
    const parent = this.findParentDeep((p) => p instanceof instanceOf)
    if (!parent) throw new Error(`Parent of type ${instanceOf.name} not found.`)
    return parent as T
  }
}
