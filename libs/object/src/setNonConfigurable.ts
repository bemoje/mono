import { objUpdatePropertyDescriptors } from './objUpdatePropertyDescriptors'

/**
 * Sets the specified properties of an object as non-configurable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setNonConfigurable(object: Record<PropertyKey, any>, ...properties: string[]): void {
  objUpdatePropertyDescriptors(object, properties, (descriptor) => {
    descriptor.configurable = false
    return descriptor
  })
}
