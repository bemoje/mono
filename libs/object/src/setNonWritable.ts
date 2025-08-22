import { objUpdatePropertyDescriptors } from './objUpdatePropertyDescriptors'

/**
 * Sets the specified properties of an object to be non-writable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setNonWritable(object: Record<PropertyKey, any>, ...properties: string[]): void {
  objUpdatePropertyDescriptors(object, properties, (descriptor) => {
    descriptor.writable = false
    return descriptor
  })
}
