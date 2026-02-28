# @mono/types

Advanced TypeScript type definitions and type-level utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Description

A collection of utility types that extend TypeScript's standard library to help express more complex constraints, map advanced types, infer deep types, and manipulate functions and structures.

## API Reference

### Function Types & Manipulation

| Export                    | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `AnyFunction`             | Matches any synchronous or asynchronous function                |
| `AnyAsyncFunction`        | Matches any asynchronous function                               |
| `AnyConstructor`          | Matches any constructor-style class/function                    |
| `AnyGetter`               | Matches any getter method signature                             |
| `AnySetter`               | Matches any setter method signature                             |
| `NamedFunction`           | Validates an object is a function with a specific name property |
| `PredicateFn`             | A type for a function returning a boolean                       |
| `FunctionPrototype`       | Gets a typed prototype interface for functions                  |
| `IsAsyncFunction`         | Type-level evaluation checking if a function is async           |
| `RemoveArgument`          | Removes an argument from a function's parameters at given index |
| `ParametersFirstOptional` | Makes the first parameter of a function optional                |
| `ParametersWithout`       | Removes a specific type from parameters                         |

### Object Types & Manipulation

| Export               | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `Any`                | Object strictly allowing any property                    |
| `AnyPrototype`       | Represents typical prototypes                            |
| `EmptyObject`        | Type that explicitly expects an empty object `{}`        |
| `DeepObject`         | Very liberal deep object with arbitrary properties       |
| `Assign`             | Overwrite types in T with those in U                     |
| `KeyOf`              | General utility analogous to `keyof`                     |
| `StringKeyOf`        | Extracts only keys that are strings                      |
| `NumberKeyOf`        | Extracts only keys that are numbers                      |
| `SymbolKeyOf`        | Extracts only keys that are symbols                      |
| `StringKeyObject`    | An object specifically mapped with string types for keys |
| `StringValObject`    | An object specifically mapped with string values         |
| `UnknownValueObject` | Utility mapped type resolving `unknown` types to object  |
| `OptionalKeys`       | Extracts keys from an object that are optional           |
| `RequiredKeys`       | Extracts keys from an object that are strictly required  |
| `GetOptional`        | Extracts optional properties into a new type             |
| `GetRequired`        | Extracts required properties into a new type             |
| `PickOptional`       | A modified Pick mapped to pick optional properties       |
| `PickRequired`       | A modified Pick mapped to pick required properties       |
| `PickPrimitive`      | Picks keys mapped to strictly primitives from an object  |
| `WithOptional`       | Marks specific keys as optional                          |
| `WithRequired`       | Marks specific keys as required                          |
| `ObjectEntry`        | Represents a single `[key, value]` tuple for an object   |
| `EntryOf`            | Key/Value map to their Tuple counterparts                |

### Primitive Utilities

| Export                 | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `Primitive`            | Union of primitive types (`string \| number \| boolean \| ...`) |
| `JsonDefinedPrimitive` | Any primitive definable statically inside JSON structures       |
| `NotUndefined`         | Strict structural omission of `undefined` values                |

### Array Utilities

| Export                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `EmptyTuple`          | Explicit definition for an empty tuple `[]`       |
| `DeepArray`           | Represents heavily nested, recursive arrays       |
| `Tail`                | Retrieves the tail elements of a tuple or array   |
| `RemoveArrayElement`  | Re-maps an array without elements matching type T |
| `RemoveArrayElements` | Drops mapped unions/elements entirely             |
| `SetArrayElement`     | Extends array structure to change items to type K |

### String & Template Types

| Export               | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `TChar`              | Generic mapped template constraint evaluating chars     |
| `TDigit`             | Single string characters matching numerical digits      |
| `TDigits`            | Collection or multiple concatenated string digits       |
| `TNonEmptyString`    | Enforces that a string is strictly not empty            |
| `TLengthOfString`    | Literal extraction deriving an exact length of string T |
| `TStringOfLength`    | Utility confirming a string evaluates to a certain size |
| `TStringNotOfLength` | Utility rejecting strings mapped via exact lengths      |
| `TStringParser`      | Experimental strict utility defining a parser string    |

### General Utility

| Export          | Description                                              |
| --------------- | -------------------------------------------------------- |
| `IntersectMany` | Recursively intersect tuples/union into one type         |
| `Decrement`     | Deep Decrement (numeric-wise mapping manipulation)       |
| `Increment`     | Deep Increment (numeric-wise mapping manipulation)       |
| `DeepEquals`    | Strict structural generic for deep equality              |
| `Optional`      | Shortcut wrapper assigning types an `undefined` property |
| `ValueOf`       | Type indicating the extracted properties inside generic  |
| `ToMethod`      | Transform literal representations                        |
| `PackageJson`   | Extended type describing `package.json` schemas          |
| `Comparator`    | Comparison standard type handler interface               |
| `Locale`        | Mapped string representations matching RFC regions       |
| `Validator`     | Standard generic validator representation                |
