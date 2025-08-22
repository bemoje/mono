/**
 * Makes the given keys (union type) optional in the given object type.
 */
export type Optional<O, K extends keyof O> = Partial<Pick<O, K>> & Omit<O, K>
