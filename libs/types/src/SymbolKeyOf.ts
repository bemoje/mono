/**
 * Symbol keys of T.
 */
export type SymbolKeyOf<T> = Extract<keyof T, symbol>
