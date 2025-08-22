/**
 * Returns an array of keys representing configurable methods or getters of an object.
 *
 * @template T - The type of the object.
 * @param obj - The object to retrieve the keys from.
 * @returns An array of keys representing configurable methods or getters.
 */
export function getConfigurableMethodOrGetterKeys<T extends object>(obj: T): string[] {
  return Object.getOwnPropertyNames(obj).filter((key) => {
    if (typeof key !== 'string') return false
    const des = Object.getOwnPropertyDescriptor(obj, key)
    if (!des) return false
    if (!des.configurable) return false
    if (typeof des.value === 'function') return true
    if (typeof des.get === 'function') return true
    return false
  })
}
