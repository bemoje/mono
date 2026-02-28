# @bemoje/is

Type checking and validation utilities with composable validators and detailed error reporting.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/is
```

## Usage

### Basic Type Guards

```ts
import { isArray, isInteger, isObject, isPositiveNumber, isEven } from '@bemoje/is'

isArray([1, 2, 3]) // true
isInteger(42) // true
isObject({ a: 1 }) // true
isPositiveNumber(-5) // false
isEven(4) // true
```

### Validate with `ensureThat`

Assert that values pass validation, throwing detailed errors on failure:

```ts
import { ensureThat, isInteger, isPositiveNumber } from '@bemoje/is'

ensureThat(42, isInteger)
// 42

ensureThat(-3, [isInteger, isPositiveNumber])
// throws ValidatorError with cause: { isPositiveNumber: false }
```

### Create Composite Validators

```ts
import { IsArrayWhereEach, isInteger, isPositiveNumber } from '@bemoje/is'

const isPosIntArray = IsArrayWhereEach([isInteger, isPositiveNumber])

isPosIntArray([1, 2, 3]) // true
isPosIntArray([1, -2, 3]) // false
isPosIntArray('hello') // false
```

### Length Validation

```ts
import { IsLength } from '@bemoje/is'

const isLen3 = IsLength(3)
isLen3([1, 2, 3]) // true
isLen3('abc') // true
isLen3([1, 2]) // false
```

### File Extension Validation

```ts
import { IsFileExt } from '@bemoje/is'

const isTs = IsFileExt('ts')
isTs('index.ts') // true
isTs('index.js') // false
```

### Comparison Validators

```ts
import { createGtValidator, createLteValidator } from '@bemoje/is'

const isGt10 = createGtValidator(10)
isGt10(15) // true
isGt10(5) // false

const isLte100 = createLteValidator(100)
isLte100(100) // true
isLte100(101) // false
```

### Validation Error Details

```ts
import { ValidatorError } from '@bemoje/is'

try {
  ensureThat(-3, [isInteger, isPositiveNumber])
} catch (e) {
  if (e instanceof ValidatorError) {
    console.log(e.input) // -3
    console.log(e.expected) // true
    console.log(e.cause) // { isPositiveNumber: false }
  }
}
```

## API Reference

| Export                         | Description                                                             |
| ------------------------------ | ----------------------------------------------------------------------- |
| `ensureThat`                   | Validate a value with one or more validators, throw on failure          |
| `IsArrayWhereEach`             | Create a validator for arrays where every element passes all validators |
| `IsLength`                     | Create a validator for values with a specific length                    |
| `IsFileExt`                    | Create a validator for file extensions                                  |
| `ValidatorError`               | Custom error class with input, expected, and cause details              |
| `createGtValidator`            | Create a greater-than validator                                         |
| `createGteValidator`           | Create a greater-than-or-equal validator                                |
| `createLtValidator`            | Create a less-than validator                                            |
| `createLteValidator`           | Create a less-than-or-equal validator                                   |
| `isArray`                      | Check if value is an array                                              |
| `isChar`                       | Check if value is a single character                                    |
| `isClass`                      | Check if value is a class constructor                                   |
| `isConstructor`                | Check if value is a constructor                                         |
| `isDefined`                    | Check if value is defined                                               |
| `isDefinedValue`               | Check if value is defined and not null                                  |
| `isDigit`                      | Check if value is a digit character                                     |
| `isDigits`                     | Check if value contains only digits                                     |
| `isEven`                       | Check if number is even                                                 |
| `isHex`                        | Check if value is a hex string                                          |
| `isHexOrUnicode`               | Check if value is hex or unicode                                        |
| `isIntRange`                   | Check if value is an integer within a range                             |
| `isInteger`                    | Check if value is an integer                                            |
| `isLen2`                       | Check if value has length 2                                             |
| `isNamedFunction`              | Check if value is a named function                                      |
| `isNamedFunctionArray`         | Check if value is an array of named functions                           |
| `isNegativeInteger`            | Check if value is a negative integer                                    |
| `isNegativeNumber`             | Check if value is a negative number                                     |
| `isNonZeroNegativeInteger`     | Check if value is a non-zero negative integer                           |
| `isNonZeroNegativeNumber`      | Check if value is a non-zero negative number                            |
| `isNonZeroPositiveInteger`     | Check if value is a non-zero positive integer                           |
| `isNonZeroPositiveNumber`      | Check if value is a non-zero positive number                            |
| `isNull`                       | Check if value is null                                                  |
| `isNumArrayAscending`          | Check if numeric array is ascending                                     |
| `isNumericString`              | Check if value is a numeric string                                      |
| `isObject`                     | Check if value is a plain object                                        |
| `isObjectType`                 | Check if value is of object type                                        |
| `isOdd`                        | Check if number is odd                                                  |
| `isPosIntArray`                | Check if value is a positive integer array                              |
| `isPosIntRange`                | Check if value is a positive integer range                              |
| `isPositiveInteger`            | Check if value is a positive integer                                    |
| `isPositiveNumber`             | Check if value is a positive number                                     |
| `isPrimitive`                  | Check if value is a primitive                                           |
| `isPrototype`                  | Check if value is a prototype object                                    |
| `isStringArray`                | Check if value is a string array                                        |
| `isStringWithNoSpacesOrDashes` | Check if string has no spaces or dashes                                 |
| `isUniqueNumArrayAscending`    | Check if numeric array is unique and ascending                          |
| `isValidNumber`                | Check if value is a valid (finite, non-NaN) number                      |
