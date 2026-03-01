// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapKeys = keyof Map<any, any>

export type GenericMap<K, V, P extends MapKeys> = {
  [Method in P]: Method extends 'set' ?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: K, value: V) => any
  : Method extends 'get' ? (key: K) => V | undefined
  : Method extends 'has' ? (key: K) => boolean
  : Method extends 'delete' ? (key: K) => boolean
  : Method extends 'clear' ? () => void
  : Method extends 'forEach' ?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) => void
  : Method extends 'entries' ? () => IterableIterator<[K, V]>
  : Method extends 'keys' ? () => IterableIterator<K>
  : Method extends 'values' ? () => IterableIterator<V>
  : Method extends typeof Symbol.iterator ? () => IterableIterator<[K, V]>
  : Method extends 'size' ? number
  : Method extends typeof Symbol.toStringTag ? string
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
}
