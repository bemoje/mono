import { Constructor } from 'type-fest'

/**
 * Copies prototype members from a source constructor to a target constructor, excluding specified keys.
 */
export function inheritPrototypeMembers<T extends Constructor<object>>(
  target: T,
  source: Constructor<object>,
  ignoreKeys: PropertyKey[] = [],
): T {
  const ignore: Set<PropertyKey> = new Set([...ignoreKeys, 'constructor'])
  for (const key of Reflect.ownKeys(source.prototype)) {
    if (ignore.has(key)) continue
    if (Reflect.has(target.prototype, key)) continue
    const des = Object.getOwnPropertyDescriptor(source.prototype, key)
    Object.defineProperty(target.prototype, key, des as PropertyDescriptor)
  }
  return target
}
