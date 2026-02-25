import type { ParentRelationTypes } from './ParentRelationTypes'
import type { Parenting } from './Parenting'

export interface ParentingTarget<P extends object | null = object | null> {
  get parenting(): Parenting<P>
}

export type ParentingTargetConstructor<P extends object | null = object | null> = {
  parenting?: ParentRelationTypes<P>
} & typeof Function.prototype
