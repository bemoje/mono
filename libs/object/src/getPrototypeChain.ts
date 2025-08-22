/**
 * Get the prototype chain of any object.
 * Returns prototype objects, not constructors.
 */
export function getPrototypeChain(target: object, options?: { includeSelf?: boolean }): object[] {
  const result: object[] = []

  if (options?.includeSelf) {
    result.push(target)
  }

  let current: object | null = target
  while ((current = Reflect.getPrototypeOf(current))) {
    result.push(current)
  }

  return result
}
