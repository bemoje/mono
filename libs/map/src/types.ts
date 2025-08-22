import { Any } from '@mono/types'

export type MapKeys = keyof Map<Any, Any>

export type GenericMap<K, V, P extends MapKeys> = {
  [Method in P]: Method extends 'set'
    ? (key: K, value: V) => Any
    : Method extends 'get'
      ? (key: K) => V | undefined
      : Method extends 'has'
        ? (key: K) => boolean
        : Method extends 'delete'
          ? (key: K) => boolean
          : Method extends 'clear'
            ? () => void
            : Method extends 'forEach'
              ? (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: Any) => void
              : Method extends 'entries'
                ? () => IterableIterator<[K, V]>
                : Method extends 'keys'
                  ? () => IterableIterator<K>
                  : Method extends 'values'
                    ? () => IterableIterator<V>
                    : Method extends typeof Symbol.iterator
                      ? () => IterableIterator<[K, V]>
                      : Method extends 'size'
                        ? number
                        : Method extends typeof Symbol.toStringTag
                          ? string
                          : Any
}
