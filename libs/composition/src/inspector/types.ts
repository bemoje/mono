import { InspectOptions as NativeInspectOptions } from 'util'
import { InspectorTarget } from './Inspector'

export interface InspectorOptions {
  inspect?: NativeInspectOptions
  ignoreValues?: IgnoreValuesOptions
  keys?: (string | symbol)[]
  autoAddBooleanKeys?: boolean
  ignoreKeys?: (string | symbol)[]
  filters?: InspectFilter[]
}

export interface IgnoreValuesOptions {
  // defaults to true
  noEmptyArray?: boolean
  // defaults to true
  noEmptyObject?: boolean
  // defaults to true
  noNull?: boolean
  // defaults to true
  noUndefined?: boolean
  // defaults to false
  noFalse?: boolean
}

export type IgnoreValueFilter = (value: unknown) => boolean

export type InspectFilter = <T extends InspectorTarget>(
  this: T,
  value: unknown,
  key: string | symbol,
  depth: number,
  object: T,
) => boolean

export type ClassInspectorMixin = typeof Function.prototype & { inspector: InspectorOptions }
