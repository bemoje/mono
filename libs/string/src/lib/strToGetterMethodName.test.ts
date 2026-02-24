import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { strToGetterMethodName } from './strToGetterMethodName'

describe(strToGetterMethodName.name, () => {
  it('should prepend get and capitalize first char', () => {
    expect(strToGetterMethodName('name')).toBe('getName')
    expect(strToGetterMethodName('value')).toBe('getValue')
  })
})
