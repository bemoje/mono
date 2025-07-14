export type EntryOf<T extends object> = [keyof T, T[keyof T]]
