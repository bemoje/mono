# @bemoje/number

Number formatting, rounding, and mathematical utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**NumberFormatter**](./src/NumberFormatter.ts): A utility class for formatting and parsing numbers with locale-specific separators. This class allows for customizing thousand and decimal separators, setting precision for decimal places, and supports different locales for international number formatting.
- [**bytesToKilobytes**](./src/bytesToKilobytes.ts): Converts a given number of bytes into kilobytes.
- [**bytesToMegabytes**](./src/bytesToMegabytes.ts): Converts a given number of bytes into megabytes.
- [**round**](./src/round.ts): Round a number to a specified number of decimal places.
- [**roundDown**](./src/roundDown.ts): Round a given number down with a given precision. Shifts with exponential notation to avoid floating-point issues.
- [**roundToNearest**](./src/roundToNearest.ts): Round a given number to a given nearest whole number.
- [**roundUp**](./src/roundUp.ts): Round a given number up with a given precision. Shifts with exponential notation to avoid floating-point issues.
- [**roundWith**](./src/roundWith.ts): Round a given number with a given precision and rounding function. Shifts with exponential notation to avoid floating-point issues.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/number
```

## Usage

### Rounding

Precision-safe rounding using exponential notation to avoid floating-point issues:

```ts
import { round, roundUp, roundDown, roundToNearest, roundWith } from '@bemoje/number'

round(1.2345, 2) // 1.23
roundUp(1.2345, 2) // 1.24
roundDown(5.6789, 2) // 5.67
roundToNearest(111, 10) // 110

// Custom rounding function
roundWith(1.5, 0, Math.ceil) // 2
```

### Number Formatting

Locale-aware number formatting and parsing:

```ts
import { NumberFormatter } from '@bemoje/number'

const fmt = new NumberFormatter(2)
fmt.format(1234567.89) // '1,234,567.89'
fmt.parse('1,234.56') // 1234.56

// Danish locale
fmt.locale('da-DK')
fmt.format(1234567.89) // '1.234.567,89'

// Define custom locales
NumberFormatter.defineLocale('fr-FR', ' ', ',')
```

### Ranges and Random

```ts
import { numRange, randomIntBetween } from '@bemoje/number'

numRange(1, 5) // [1, 2, 3, 4, 5]
randomIntBetween(1, 10) // random integer between 1 and 10
```

### Byte Conversion

```ts
import { bytesToKilobytes, bytesToMegabytes } from '@bemoje/number'

bytesToKilobytes(1024) // 1
bytesToMegabytes(1048576) // 1
```
