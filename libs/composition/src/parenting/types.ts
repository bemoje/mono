import { Parenting } from './Parenting'
import { ParentRelationTypes } from './ParentRelationTypes'

export interface ParentingTarget<P extends object | null = object | null> {
  get parenting(): Parenting<P>
}

export type ParentingTargetConstructor<P extends object | null = object | null> = {
  parenting?: ParentRelationTypes<P>
} & typeof Function.prototype
