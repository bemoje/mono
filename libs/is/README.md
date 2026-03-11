# @bemoje/is

Type checking and validation utilities with composable validators and detailed error reporting.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**IsArrayWhereEach**](./src/IsArrayWhereEach.ts): Creates a validator function that checks whether the input is an array where all elements are valid according to every validator provided.
- [**IsFileExt**](./src/IsFileExt.ts): Creates a validator function that checks if a string has the specified file extension (case-insensitive).
- [**IsLength**](./src/IsLength.ts): Creates a function that validates if the length of the input is equal to the specified length. The returned function accepts any value with a 'length' property and is named 'isLen' concatenated with the specified length.
- [**ValidatorError**](./src/ValidatorError.ts): Custom error class for validation failures, providing detailed information about the input, expected outcome, and cause of failure.
- [**createGtValidator**](./src/createGtValidator.ts): Creates a validator function that checks if a value is a number greater than the specified limit.
- [**createGteValidator**](./src/createGteValidator.ts): Creates a validator function that checks if a value is a number greater than or equal to the specified limit.
- [**createLtValidator**](./src/createLtValidator.ts): Creates a validator function that checks if a value is a number less than the specified limit.
- [**createLteValidator**](./src/createLteValidator.ts): Creates a validator function that checks if a value is a number less than or equal to the specified limit.
- [**ensureThat**](./src/ensureThat.ts): Validates a value using the provided sync or async validator function(s). If validation fails, an error is thrown with details about the failure. Validators can return strings indicating the reason for failure, which will be included in the error message.
- [**isArray**](./src/isArray.ts): Checks if the provided value is an array.
- [**isChar**](./src/isChar.ts): Determines whether a string is a single character.
- [**isClass**](./src/isClass.ts): Checks if the given value is a constructor function using 'class' syntax. WARNING: If the running code is minified or mangled, this function may not work as expected. However, it should be resistant to minification/mangling if the 'class' keyword is present in the first line of the function.
- [**isConstructor**](./src/isConstructor.ts): Checks if the given value is a valid constructor function.
- [**isDefined**](./src/isDefined.ts): This function checks if a value is defined or not. It performs a strict comparison against `undefined`.
- [**isDigit**](./src/isDigit.ts): Returns true if the given character is a digit between 0 and 9.
- [**isDigits**](./src/isDigits.ts): Returns true if the given string is a string of digits between 0 and 9.
- [**isEven**](./src/isEven.ts): Checks if a number is even.
- [**isHex**](./src/isHex.ts): Checks if a string is a hexadecimal number. Understands prefixes for hex colors, hex decimal and regexp unicode hex.
- [**isHexOrUnicode**](./src/isHexOrUnicode.ts): Checks if a given string is a hexadecimal or unicode.
- [**isIntRange**](./src/isIntRange.ts): Determine whether the input is an array of two integers in ascending order.
- [**isInteger**](./src/isInteger.ts): Checks if the provided number is an integer.
- [**isLen2**](./src/isLen2.ts): Determine whether the input has length of 2.
- [**isNamedFunction**](./src/isNamedFunction.ts): Checks if the provided value is a named function.
- [**isNamedFunctionArray**](./src/isNamedFunctionArray.ts): Checks if the provided value is an array containing only named functions.
- [**isNegativeInteger**](./src/isNegativeInteger.ts): Checks if a given number is a negative integer.
- [**isNegativeNumber**](./src/isNegativeNumber.ts): Checks if a given number is negative or zero.
- [**isNonZeroNegativeInteger**](./src/isNonZeroNegativeInteger.ts): Checks if a given number is a negative non-zero integer.
- [**isNonZeroNegativeNumber**](./src/isNonZeroNegativeNumber.ts): Checks if a given value is a negative number less than zero.
- [**isNonZeroPositiveInteger**](./src/isNonZeroPositiveInteger.ts): Checks if a given number is a positive non-zero integer.
- [**isNonZeroPositiveNumber**](./src/isNonZeroPositiveNumber.ts): Checks if a given value is a positive number greater than zero.
- [**isNumArrayAscending**](./src/isNumArrayAscending.ts): Determine whether the input is an array of numbers in ascending order. Duplicate values are allowed.
- [**isNumericString**](./src/isNumericString.ts): Checks if a given string is numeric.
- [**isObject**](./src/isObject.ts): Checks if the provided value is an object (null, arrays and functions not included).
- [**isObjectType**](./src/isObjectType.ts): Checks if the provided value is an object type (null and functions included, array not included).
- [**isOdd**](./src/isOdd.ts): Checks if a number is odd.
- [**isPosIntArray**](./src/isPosIntArray.ts): Determine whether the input is a positive (including zero) integer array.
- [**isPosIntRange**](./src/isPosIntRange.ts): Checks if the input is an array of exactly two positive integers in ascending order, representing a valid range.
- [**isPositiveInteger**](./src/isPositiveInteger.ts): Checks if a given number is a positive integer.
- [**isPositiveNumber**](./src/isPositiveNumber.ts): Checks if a given value is a positive number (including zero).
- [**isPrototype**](./src/isPrototype.ts): Checks if the given value is a prototype object
- [**isStringArray**](./src/isStringArray.ts): Determine whether the input is a string array.
- [**isStringWithNoSpacesOrDashes**](./src/isStringWithNoSpacesOrDashes.ts): Checks if the provided value is a string that contains no spaces or dashes.
- [**isUniqueNumArrayAscending**](./src/isUniqueNumArrayAscending.ts): Determine whether the input is an array of numbers in ascending order. Duplicate values are not allowed.
- [**isValidNumber**](./src/isValidNumber.ts): Checks if the provided value is a valid finite number (not NaN or Infinity).

<!-- EXPORTS_END -->

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
