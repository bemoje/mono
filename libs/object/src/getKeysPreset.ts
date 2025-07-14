import { isEnumerable } from './isEnumerable'

/**
 * Creates a preset function for getting object keys with specific filtering options.
 */
export function GetKeysPreset<K extends OptsKeysVariants, KT extends OptsKeyTypeVariants>(
  options?: GetKeysOptions<K, KT>,
): (o: object) => KeysPrimitiveTypeFrom<KT>[] {
  const ignore = new Set(options?.ignore ?? [])
  if (options?.ignoreSymbols) {
    if (options?.ignoreEnumerable) {
      return (o: object) =>
        Object.getOwnPropertyNames(o)
          .filter((k) => !isEnumerable(o, k))
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else if (options?.ignoreNonEnumerable) {
      return (o: object) => Object.keys(o).filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else {
      return (o: object) =>
        Object.getOwnPropertyNames(o).filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    }
  } else if (options?.ignoreStrings) {
    if (options?.ignoreEnumerable) {
      return (o: object) =>
        Reflect.ownKeys(o)
          .filter((k) => typeof k !== 'string')
          .filter((k) => !isEnumerable(o, k))
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else if (options?.ignoreNonEnumerable) {
      return (o: object) =>
        Reflect.ownKeys(o)
          .filter((k) => typeof k !== 'string')
          .filter((k) => isEnumerable(o, k))
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else {
      return (o: object) =>
        Reflect.ownKeys(o)
          .filter((k) => typeof k !== 'string')
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    }
  } else {
    if (options?.ignoreEnumerable) {
      return (o: object) =>
        Reflect.ownKeys(o)
          .filter((k) => !isEnumerable(o, k))
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else if (options?.ignoreNonEnumerable) {
      return (o: object) =>
        Reflect.ownKeys(o)
          .filter((k) => isEnumerable(o, k))
          .filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    } else {
      return (o: object) => Reflect.ownKeys(o).filter((k) => !ignore.has(k)) as KeysPrimitiveTypeFrom<KT>[]
    }
  }
}

interface IOptsKeys {
  ignoreEnumerable?: boolean
  ignoreNonEnumerable?: boolean
}
interface IOptsEnumerableKeys extends IOptsKeys {
  ignoreEnumerable?: false
  ignoreNonEnumerable: true
}
interface IOptsNonEnumerableKeys extends IOptsKeys {
  ignoreEnumerable: true
  ignoreNonEnumerable?: false
}
interface IOptsEnumerableAndNonEnumerableKeys extends IOptsKeys {
  ignoreEnumerable?: false
  ignoreNonEnumerable?: false
}
interface IOptsKeyType {
  ignore?: (string | symbol)[]
  ignoreSymbols?: boolean
  ignoreStrings?: boolean
}
interface IOptsStringKeys extends IOptsKeyType {
  ignore?: string[]
  ignoreSymbols: true
  ignoreStrings?: false
}
interface IOptsSymbolKeys extends IOptsKeyType {
  ignore?: symbol[]
  ignoreSymbols?: false
  ignoreStrings: true
}
interface IOptsStringAndSymbolKeys extends IOptsKeyType {
  ignore?: (string | symbol)[]
  ignoreSymbols?: false
  ignoreStrings?: false
}
export type OptsKeysVariants = IOptsEnumerableKeys | IOptsNonEnumerableKeys | IOptsEnumerableAndNonEnumerableKeys
export type OptsKeyTypeVariants = IOptsStringKeys | IOptsSymbolKeys | IOptsStringAndSymbolKeys
export type GetKeysOptions<K extends OptsKeysVariants, KT extends OptsKeyTypeVariants> = K & KT
export type KeysPrimitiveTypeFrom<P extends OptsKeyTypeVariants> = P extends IOptsStringKeys
  ? string
  : P extends IOptsSymbolKeys
    ? symbol
    : string | symbol
