# @mono/string

String manipulation utilities for casing, wrapping, line processing, and character analysis.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Usage

### Case & Casing

```ts
import { strFirstCharToUpperCase, strFirstCharToLowerCase, titleCaseWord, strSplitCamelCase } from '@mono/string'

strFirstCharToUpperCase('hello')
// => 'Hello'

strFirstCharToLowerCase('Hello')
// => 'hello'

titleCaseWord('hello')
// => 'Hello'

strSplitCamelCase('someCamel10Case')
// => ['some', 'Camel10', 'Case']
```

### Wrapping & Unwrapping

```ts
import { strWrapBetween, strWrapIn, strWrapInBraces, strUnwrap, unwrapDoubleQuotes } from '@mono/string'

strWrapBetween('Hello', '<', '>')
// => '<Hello>'

strWrapIn('hello', '*')
// => '*hello*'

strWrapInBraces('key')
// => '{key}'

strUnwrap('[value]', '[', ']')
// => 'value'

unwrapDoubleQuotes('"hello"')
// => 'hello'
```

### Ensure Prefix & Suffix

```ts
import { strEnsureStartsWith, strEnsureEndsWith, strPrefixCamelCased } from '@mono/string'

strEnsureEndsWith('52', ' kg')
// => '52 kg'

strEnsureStartsWith('/path', '/')
// => '/path'

strPrefixCamelCased('name', 'get')
// => 'getName'
```

### Line Processing

```ts
import {
  stringLineCount,
  strPrependLines,
  strTrimLines,
  strRemoveEmptyLines,
  strNoConsecutiveEmptyLines,
} from '@mono/string'

stringLineCount('a\nb\nc')
// => 3

strPrependLines('line1\nline2', '> ')
// => '> line1\n> line2'

strTrimLines('  hello  \n  world  ')
// => 'hello\nworld'

strRemoveEmptyLines('a\n\nb\n\nc')
// => 'a\nb\nc'

strNoConsecutiveEmptyLines('a\n\n\n\nb')
// => 'a\n\nb'
```

### Character Analysis

```ts
import { strCountChars, strCountCharOccurances, strToCharSet, strToCharCodes } from '@mono/string'

strCountChars('hello')
// => Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }

strCountCharOccurances('banana', 'a')
// => 3

strToCharSet('hello')
// => Set { 'h', 'e', 'l', 'o' }

strToCharCodes('abc')
// => [97, 98, 99]
```

### Search & Replace

```ts
import { strReplaceAll, strSplitAndTrim } from '@mono/string'

strReplaceAll('a-b-c', '-', '.')
// => 'a.b.c'

strSplitAndTrim('a , b , c', ',')
// => ['a', 'b', 'c']
```

### Inspection

```ts
import { strIsLowerCase, strIsUpperCase, strIsMultiLine, strParseBoolean } from '@mono/string'

strIsLowerCase('hello')
// => true

strIsUpperCase('HELLO')
// => true

strIsMultiLine('a\nb')
// => true

strParseBoolean('true')
// => true
```

## API Reference

### Case & Naming

| Export                    | Description                                 |
| ------------------------- | ------------------------------------------- |
| `strFirstCharToUpperCase` | Convert the first character to uppercase    |
| `strFirstCharToLowerCase` | Convert the first character to lowercase    |
| `titleCaseWord`           | Title-case a single word                    |
| `strSplitCamelCase`       | Split a camelCase string into words         |
| `strPrefixCamelCased`     | Prepend a prefix in camelCase style         |
| `strToGetterMethodName`   | Create a getter method name (prepend "get") |
| `strToSetterMethodName`   | Create a setter method name (prepend "set") |

### Wrapping & Unwrapping

| Export                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `strWrapBetween`         | Wrap a string between two different strings      |
| `strWrapIn`              | Wrap a string with the same string on both sides |
| `strWrapInAngleBrackets` | Wrap in angle brackets `< >`                     |
| `strWrapInBraces`        | Wrap in curly braces `{ }`                       |
| `strWrapInBrackets`      | Wrap in square brackets `[ ]`                    |
| `strWrapInDoubleQuotes`  | Wrap in double quotes                            |
| `strWrapInSingleQuotes`  | Wrap in single quotes                            |
| `strWrapInParenthesis`   | Wrap in parentheses `( )`                        |
| `strUnwrap`              | Remove specified left/right substrings           |
| `unwrapDoubleQuotes`     | Remove surrounding double quotes                 |

### Ensure & Pad

| Export                | Description                             |
| --------------------- | --------------------------------------- |
| `strEnsureStartsWith` | Ensure a string starts with a substring |
| `strEnsureEndsWith`   | Ensure a string ends with a substring   |
| `strRepeat`           | Repeat a string N times                 |

### Line Processing

| Export                           | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `stringLineCount`                | Count the number of lines                     |
| `strIsMultiLine`                 | Check if a string contains multiple lines     |
| `strPrependLines`                | Prepend a string to each line                 |
| `strTrimLines`                   | Trim whitespace from each line                |
| `strTrimLinesLeft`               | Trim leading whitespace from each line        |
| `strTrimLinesRight`              | Trim trailing whitespace from each line       |
| `strRemoveEmptyLines`            | Remove all empty lines                        |
| `strRemoveFirstAndLastLine`      | Remove the first and last line                |
| `strRemoveNewLines`              | Remove all newline characters                 |
| `strNoConsecutiveEmptyLines`     | Collapse consecutive empty lines into one     |
| `strMaxTwoConsecutiveEmptyLines` | Limit consecutive empty lines to two          |
| `strNoConsecutiveWhitespace`     | Replace consecutive whitespace with one space |

### Character Analysis

| Export                    | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `strCountChars`           | Count occurrences of each character (returns Map) |
| `strCountCharOccurances`  | Count occurrences of a single character           |
| `strToCharSet`            | Get unique characters as a Set                    |
| `strToCharCodes`          | Convert to array of character codes               |
| `strToSortedCharSet`      | Get sorted string of unique characters            |
| `strSortChars`            | Sort characters alphabetically                    |
| `strRemoveDuplicateChars` | Remove duplicate characters                       |

### Search & Replace

| Export            | Description                            |
| ----------------- | -------------------------------------- |
| `strReplaceAll`   | Replace all occurrences of a substring |
| `strSplitAndTrim` | Split by delimiter and trim each part  |

### Inspection & Parsing

| Export                               | Description                                     |
| ------------------------------------ | ----------------------------------------------- |
| `strIsLowerCase`                     | Check if string is entirely lowercase           |
| `strIsUpperCase`                     | Check if string is entirely uppercase           |
| `strParseBoolean`                    | Parse a string to boolean                       |
| `countFloatDecimals`                 | Count decimal places in a floating-point number |
| `endsWithIncompleteUtfPairSurrogate` | Check for incomplete UTF-16 surrogate at end    |
