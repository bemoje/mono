# @mono/string

String manipulation utilities for casing, wrapping, line processing, and character analysis.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**countFloatDecimals**](./src/lib/countFloatDecimals.ts): Counts the number of decimal places in a floating-point number.
- [**endsWithIncompleteUtfPairSurrogate**](./src/lib/endsWithIncompleteUtfPairSurrogate.ts): Returns true if the string ends with an incomplete UTF-16 surrogate pair. This is useful for determining if a string can be safely concatenated with another string.
- [**strCountCharOccurances**](./src/lib/strCountCharOccurances.ts): Counts the number of occurrences of a specific character in a string.
- [**strCountChars**](./src/lib/strCountChars.ts): Counts the number of occurrences of each character in a string and returns a Map where the keys are the characters and the values are their counts.
- [**strEnsureEndsWith**](./src/lib/strEnsureEndsWith.ts): Ensures that a string ends with a specified substring. If the string already ends with the specified substring, it is returned as is. Otherwise, the substring is appended to the end of the string.
- [**strEnsureStartsWith**](./src/lib/strEnsureStartsWith.ts): Ensures that a string starts with a specified substring. If the string already starts with the specified substring, it is returned as is. Otherwise, the substring is appended to the end of the string.
- [**strIsLowerCase**](./src/lib/strIsLowerCase.ts): Checks if the given string is in lower case.
- [**strIsMultiLine**](./src/lib/strIsMultiLine.ts): Checks if a string contains multiple lines.
- [**strIsUpperCase**](./src/lib/strIsUpperCase.ts): Checks if the given string is in upper case.
- [**strMaxTwoConsecutiveEmptyLines**](./src/lib/strMaxTwoConsecutiveEmptyLines.ts): Replaces all occurrences of more than two consecutive empty lines with two empty lines.
- [**strNoConsecutiveEmptyLines**](./src/lib/strNoConsecutiveEmptyLines.ts): Removes consecutive empty lines from a given string.
- [**strNoConsecutiveWhitespace**](./src/lib/strNoConsecutiveWhitespace.ts): Removes consecutive whitespace characters in a string and replaces them with a single space.
- [**strParseBoolean**](./src/lib/strParseBoolean.ts): Parses a string into a boolean.
- [**strPrefixCamelCased**](./src/lib/strPrefixCamelCased.ts): Prepend a camelCased string. Examples:
- [**strPrependLines**](./src/lib/strPrependLines.ts): Prepend each line of a string with a specified string.
- [**strRemoveDuplicateChars**](./src/lib/strRemoveDuplicateChars.ts): Removes duplicate characters from a string.
- [**strRemoveEmptyLines**](./src/lib/strRemoveEmptyLines.ts): Removes all empty lines from a given string.
- [**strRemoveFirstAndLastLine**](./src/lib/strRemoveFirstAndLastLine.ts): Removes the first and last line from a given string.
- [**strRemoveNewLines**](./src/lib/strRemoveNewLines.ts): Removes all new line characters from a string.
- [**strRepeat**](./src/lib/strRepeat.ts): Repeats the given string `n` times.
- [**strReplaceAll**](./src/lib/strReplaceAll.ts): Replaces all occurrences of a substring in a string with a specified replacement.
- [**strSortChars**](./src/lib/strSortChars.ts): Sorts the characters in a string in alphabetical order.
- [**strSplitAndTrim**](./src/lib/strSplitAndTrim.ts): Splits a string by a specified delimiter and trims each resulting substring. Optionally, it can also remove empty lines.
- [**strSplitCamelCase**](./src/lib/strSplitCamelCase.ts): Returns an array of words in the string
- [**strToCharCodes**](./src/lib/strToCharCodes.ts): Converts a string to an array of character codes.
- [**strToCharSet**](./src/lib/strToCharSet.ts): Converts a string to a set of unique characters.
- [**strToGetterMethodName**](./src/lib/strToGetterMethodName.ts): Prepend a camelCased string with 'get'.
- [**strToSetterMethodName**](./src/lib/strToSetterMethodName.ts): Prepend a camelCased string with 'set'.
- [**strToSortedCharSet**](./src/lib/strToSortedCharSet.ts): Converts a string to a sorted set of unique characters.
- [**strTrimLines**](./src/lib/strTrimLines.ts): Trims leading and trailing whitespace from each line in a string.
- [**strTrimLinesLeft**](./src/lib/strTrimLinesLeft.ts): Trims the leading whitespace from each line in a string.
- [**strTrimLinesRight**](./src/lib/strTrimLinesRight.ts): Trims trailing whitespace from each line in a string.
- [**strUnwrap**](./src/lib/strUnwrap.ts): Removes the specified left and right substrings from the input string.
- [**strWrapBetween**](./src/lib/strWrapBetween.ts): Wraps a string between two other strings.
- [**strWrapIn**](./src/lib/strWrapIn.ts): Wraps a given string with another string.
- [**strWrapInAngleBrackets**](./src/lib/strWrapInAngleBrackets.ts): Wraps a string in angle brackets.
- [**strWrapInBraces**](./src/lib/strWrapInBraces.ts): Wraps a given string in braces.
- [**strWrapInBrackets**](./src/lib/strWrapInBrackets.ts): Wraps a string in brackets.
- [**strWrapInDoubleQuotes**](./src/lib/strWrapInDoubleQuotes.ts): Wraps a given string in double quotes.
- [**strWrapInParenthesis**](./src/lib/strWrapInParenthesis.ts): Wraps a given string in parenthesis.
- [**strWrapInSingleQuotes**](./src/lib/strWrapInSingleQuotes.ts): Wraps a given string in single quotes.
- [**stringLineCount**](./src/lib/stringLineCount.ts): Count the number of lines in a string.
- [**unwrapDoubleQuotes**](./src/lib/unwrapDoubleQuotes.ts): Remove double quote from the beginning and end of a string and trims whitespace at the beginning and end of the string

<!-- EXPORTS_END -->

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
