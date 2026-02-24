import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { strToSetterMethodName } from './strToSetterMethodName'

describe(strToSetterMethodName.name, () => {
  it('should prepend set and capitalize first char', () => {
    expect(strToSetterMethodName('name')).toBe('setName')
    expect(strToSetterMethodName('value')).toBe('setValue')
  })
})
