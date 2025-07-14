import { objUpdatePropertyDescriptors } from './objUpdatePropertyDescriptors'
import { describe, expect, it } from 'vitest'

describe(objUpdatePropertyDescriptors.name, () => {
  it('should update property descriptors of specified properties on the object', () => {
    const object = {
      name: 'John',
      age: 30,
    }
    objUpdatePropertyDescriptors(object, ['name'], (descriptor, property) => ({
      ...descriptor,
      enumerable: false,
    }))
    expect(Object.getOwnPropertyDescriptor(object, 'name')).toEqual({
      value: 'John',
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  it('should throw an error if a specified property does not exist on the object', () => {
    const object = {
      name: 'John',
      age: 30,
    }
    expect(() => {
      objUpdatePropertyDescriptors(object, ['address'], (descriptor, property) => descriptor)
    }).toThrowError("Property, 'address' does not exist on object.")
  })

  it('should throw an error if any of the specified properties do not exist on the object', () => {
    const object = {
      name: 'John',
      age: 30,
    }
    expect(() => {
      objUpdatePropertyDescriptors(object, ['name', 'address'], (descriptor, property) => descriptor)
    }).toThrowError("Property, 'address' does not exist on object.")
  })
})
