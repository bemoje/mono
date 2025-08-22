/**
 * Get the class name of an object from its constructor.
 */
export function className(target: object): string {
  return target.constructor.name
}
