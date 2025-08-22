import { TFunction } from './TFunction'

/**
 * Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends TFunction ? K : never
}[keyof T]

/**
 * Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

/**
 * Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends TFunction ? never : K
}[keyof T]

/**
 * Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
 */
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

// // Example
// interface Part {
//   id: number
//   name: string
//   subparts: Part[]
//   updatePart(newName: string): void
// }

// type T40 = FunctionPropertyNames<Part> // "updatePart"
// type T41 = NonFunctionPropertyNames<Part> // "id" | "name" | "subparts"
// type T42 = FunctionProperties<Part> // { updatePart(newName: string): void }
// type T43 = NonFunctionProperties<Part> // { id: number, name: string, subparts: Part[] }
