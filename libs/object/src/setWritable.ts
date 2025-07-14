import { objUpdatePropertyDescriptors } from './objUpdatePropertyDescriptors'

/**
 * Sets the specified properties of an object to be writable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setWritable(object: Record<PropertyKey, any>, ...properties: string[]): void {
  objUpdatePropertyDescriptors(object, properties, (descriptor) => {
    descriptor.writable = true
    return descriptor
  })
}
