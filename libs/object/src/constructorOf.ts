/**
 * Returns the constructor of the given object.
 */
export function constructorOf<T = object>(o: T) {
  return Object.getPrototypeOf(o).constructor
}
