/**
 * Gets the union type of all values in the given object type.
 */
export type ValueOf<O> = O[keyof O]
