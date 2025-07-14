import {
  GetKeysPreset,
  GetKeysOptions,
  KeysPrimitiveTypeFrom,
  OptsKeysVariants,
  OptsKeyTypeVariants,
} from './getKeysPreset'

/**
 * Returns an array of the own property keys of an object.
 *
 * Every combination of ways to toggle enumerable/non-enumerable/strings/symbols
 * are available. Ignoring specific keys is also possible.
 *
 * @remarks
 * The options are typed so that non-sensical or impossible combinations are disallowed.
 *
 * @remarks
 * The prototype chain is not traversed, but used in tandom with
 * @see prototypeChain you can easily specify exactly what keys you need.
 * @see superClassChain for traversing only class constructors of the prototype chain.
 */
export function getKeys<K extends OptsKeysVariants, KT extends OptsKeyTypeVariants>(
  o: object,
  options?: GetKeysOptions<K, KT>,
): KeysPrimitiveTypeFrom<KT>[] {
  const getter = GetKeysPreset(options)
  return getter(o)
}
