# @bemoje/date

Lightweight date and time utilities for formatting, time-unit conversion, and duration measurement.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**Timer**](./src/Timer.ts): Returns a function that returns the elapsed time since invokation.
- [**dateString**](./src/dateString.ts): Reutnrs the date formatted as: yyyy-MM-dd
- [**daysToMs**](./src/daysToMs.ts): Converts days to milliseconds.
- [**getWeek**](./src/getWeek.ts): Get the week number of the year for a given date using Danish locale.
- [**hasCooldownElapsed**](./src/hasCooldownElapsed.ts): Determines if a specified cooldown period has elapsed since a given date.
- [**hoursToMs**](./src/hoursToMs.ts): Converts hours to milliseconds.
- [**minutesToMs**](./src/minutesToMs.ts): Converts minutes to milliseconds.
- [**monthNameDa**](./src/monthNameDa.ts): Returns the name, in Danish language, of the month corresponding to the provided month number.
- [**monthNameDaRelative**](./src/monthNameDaRelative.ts): Get the (Danish) name of the month relative to the current month.
- [**msSinceDate**](./src/msSinceDate.ts): Calculates the number of milliseconds that have elapsed since the given date.
- [**secondsToMs**](./src/secondsToMs.ts): Converts seconds to milliseconds.
- [**stripTime**](./src/stripTime.ts): Remove the time component from a date, returning only the date part.
- [**today**](./src/today.ts): Get the UTC date today, time stripped
- [**yesterday**](./src/yesterday.ts): Get the UTC date yesterday, time stripped

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/date
```

## Usage

### Date Formatting

```ts
import { dateString, today, yesterday } from '@bemoje/date'

dateString()
// => '2026-02-28'

dateString(new Date(2025, 0, 15))
// => '2025-01-15'

today()
// => Date object for today at 00:00:00

yesterday()
// => Date object for yesterday at 00:00:00
```

### Time Unit Conversion

```ts
import { daysToMs, hoursToMs, minutesToMs, secondsToMs } from '@bemoje/date'

daysToMs(1) // => 86400000
hoursToMs(2) // => 7200000
minutesToMs(30) // => 1800000
secondsToMs(45) // => 45000
```

### Duration & Cooldowns

```ts
import { msSinceDate, hasCooldownElapsed, Timer } from '@bemoje/date'

// Milliseconds elapsed since a date
const start = new Date('2026-02-01')
msSinceDate(start)
// => number of ms since Feb 1

// Check if a cooldown period has passed
hasCooldownElapsed(start, daysToMs(7))
// => true (if more than 7 days have passed)

// Stopwatch-style timer
const elapsed = Timer()
// ... do some work ...
elapsed()
// => '142ms' (human-readable duration string)
```

### Week & Date Operations

```ts
import { getWeek, stripTime } from '@bemoje/date'

getWeek(new Date('2026-02-28'))
// => 9

// Remove time component from a Date
stripTime(new Date('2026-02-28T15:30:00'))
// => Date('2026-02-28T00:00:00')
```

### Danish Month Names

```ts
import { monthNameDa, monthNameDaRelative } from '@bemoje/date'

monthNameDa(new Date('2026-03-15'))
// => 'Marts'

monthNameDaRelative(new Date())
// => relative month name in Danish
```
