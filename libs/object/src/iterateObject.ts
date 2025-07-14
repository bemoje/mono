import type { PropertyPath } from 'lodash'

/**
 * Interface describing the data yielded by iterateObject for each node in the traversal
 */
export interface IterateObjectYield<T extends object = object, V = unknown> {
  /** The parent object containing the current value */
  object: object
  /** The key or index of the current value in its parent object */
  key: string | number
  /** The value at the current node */
  value: V
  /** Array representation of the path to the current node */
  propertyPathArray: (string | number)[]
  /** Lodash-compatible property path string (e.g., 'a.b[0].c') */
  propertyPath: PropertyPath
  /** Whether this node is a primitive value */
  isLeaf: boolean
  /** The type of container at this node */
  nodeType: 'object' | 'array'
  /** Reference to the root object being traversed */
  root: T
}

/**
 * Generator that performs a depth-first traversal of an object's structure.
 * Yields information about each node including its path, value, and container type.
 * Handles circular references and maintains parent-child relationships.
 *
 * Key features:
 * - Supports both objects and arrays
 * - Generates Lodash-style property paths
 * - Detects leaf nodes (primitives)
 * - Prevents circular reference loops
 * - Preserves traversal order
 */
export function* iterateObject<T extends object = object, V = unknown>(
  root: T,
): Generator<IterateObjectYield<T, V>> {
  const seen = new WeakSet()
  const stack: Pick<IterateObjectYield<T, V>, 'value' | 'propertyPathArray' | 'object'>[] = [
    { value: root as unknown as V, propertyPathArray: [], object: {} },
  ]

  while (stack.length > 0) {
    const { value: current, propertyPathArray, object } = stack.pop()!

    if (typeof current === 'object' && current !== null) {
      if (seen.has(current)) continue
      seen.add(current)

      // yield the object/array itself before traversing into it
      if (propertyPathArray.length > 0) {
        yield {
          object,
          key: propertyPathArray[propertyPathArray.length - 1],
          value: current,
          root,
          propertyPathArray,
          propertyPath: propertyPathArray
            .map((s) => (typeof s === 'string' ? s : '[' + s + ']'))
            .join('.')
            .replace(/\.\[/g, '['),
          isLeaf: false,
          nodeType: Array.isArray(current) ? 'array' : 'object',
        }
      }

      if (Array.isArray(current)) {
        // push array elements in reverse order so they're processed in forward order
        for (let i = current.length - 1; i >= 0; i--) {
          stack.push({
            value: current[i],
            propertyPathArray: propertyPathArray.concat(i),
            object: current,
          })
        }
      } else {
        // push object entries in reverse order so they're processed in forward order
        const entries = Object.entries(current)
        for (let i = entries.length - 1; i >= 0; i--) {
          const [key, value] = entries[i]
          stack.push({
            value: value,
            propertyPathArray: propertyPathArray.concat(key),
            object: current,
          })
        }
      }
    } else {
      // yield primitive values
      yield {
        object,
        value: current,
        key: propertyPathArray[propertyPathArray.length - 1],
        root,
        propertyPathArray,
        propertyPath: propertyPathArray
          .map((s) => (typeof s === 'string' ? s : '[' + s + ']'))
          .join('.')
          .replace(/\.\[/g, '['),
        isLeaf: true,
        nodeType: Array.isArray(current) ? 'array' : 'object',
      }
    }
  }
}
