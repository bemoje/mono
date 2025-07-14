import colors from 'ansi-colors'
import { DefaultMap } from 'mnemonist'
import { MultiSet } from 'mnemonist'
import type { Any, FunctionPrototype } from '@mono/types'
import { ParentingTargetConstructor } from './types'
import { View } from '../View'

/**
 * Manages parent-child relationships between constructor types, tracking hierarchical connections and providing debugging capabilities.
 */
export class ParentRelationTypes<P extends object | null = object | null> extends View<
  ParentingTargetConstructor<P>
> {
  registerParent(parentType: FunctionPrototype) {
    ParentRelationTypes.parentTypesStats.get(this.target).add(parentType)
    ParentRelationTypes.childTypesStats.get(parentType).add(this.target)
  }

  get hasParent(): boolean {
    return ParentRelationTypes.parentTypesStats.has(this.target)
  }
  get getParentTypes(): MultiSet<FunctionPrototype> {
    return ParentRelationTypes.parentTypesStats.get(this.target)
  }

  get hasChildren(): boolean {
    return ParentRelationTypes.childTypesStats.has(this.target)
  }
  get getChildTypes(): MultiSet<FunctionPrototype> {
    return ParentRelationTypes.childTypesStats.get(this.target)
  }

  get isRoot(): boolean {
    return !this.hasParent && this.hasChildren
  }
  get isLeaf() {
    return this.hasParent && !this.hasChildren
  }
  get isIsolated(): boolean {
    return !this.hasParent && !this.hasChildren
  }

  static getAllChildTypesStats() {
    const res: Record<string, Record<string, number>> = {}
    Array.from(this.childTypesStats.entries()).map(([cls, multimap]) => {
      multimap.forEachMultiplicity((count, key) => {
        if (!res[cls.name]) res[cls.name] = {}
        if (!res[cls.name][key.name]) res[cls.name][key.name] = count
      })
    })
    return res
  }

  static getAllParentTypesStats() {
    const res: Record<string, Record<string, number>> = {}
    Array.from(this.parentTypesStats.entries()).map(([cls, multimap]) => {
      multimap.forEachMultiplicity((count, key) => {
        if (!res[cls.name]) res[cls.name] = {}
        if (!res[cls.name][key.name]) res[cls.name][key.name] = count
      })
    })
    return res
  }

  static getAllStats() {
    const classes = new Set([
      ...Array.from(this.childTypesStats.keys()),
      ...Array.from(this.parentTypesStats.keys()),
    ])
    return Array.from(classes).map((cls) => {
      const parents = Array.from(this.parentTypesStats.get(cls).multiplicities()).map(([cls, count]) => [
        cls.name,
        count,
      ])
      const children = Array.from(this.childTypesStats.get(cls).multiplicities()).map(([cls, count]) => [
        cls.name,
        count,
      ])
      const result = { class: cls.name } as Any
      if (parents.length) result.parents = Object.fromEntries(parents)
      if (children.length) result.children = Object.fromEntries(children)
      return result
    })
  }

  static printAllStats() {
    console.log()
    console.log(colors.bold.yellow('Parent-Child Relation Stats'))
    for (const stats of this.getAllStats()) {
      console.log(stats.class)
      if (stats.parents) {
        let prefix = ` ${colors.dim('parents  : ')}`
        for (const [parent, count] of Object.entries(stats.parents)) {
          console.log(prefix + `${colors.blue(parent)}: ${colors.yellow(String(count))}`)
          prefix = ' '.repeat(12)
        }
      }
      if (stats.children) {
        let prefix = ` ${colors.dim('children : ')}`
        for (const [child, count] of Object.entries(stats.children)) {
          console.log(prefix + `${colors.green(child)}: ${colors.yellow(String(count))}`)
          prefix = ' '.repeat(12)
        }
      }
      console.log()
    }
  }

  static childTypesStats = new DefaultMap<FunctionPrototype, MultiSet<FunctionPrototype>>(() => new MultiSet())
  static parentTypesStats = new DefaultMap<FunctionPrototype, MultiSet<FunctionPrototype>>(() => new MultiSet())
}
