/**
 * An object type mapped to string values for each key
 */
export type StringValObject<T> = { [K in keyof T]: string }
