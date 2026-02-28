# @bemoje/date

Lightweight date and time utilities for formatting, time-unit conversion, and duration measurement.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

| Export                | Description                                  |
| --------------------- | -------------------------------------------- |
| `dateString`          | Format date as `yyyy-MM-dd`                  |
| `today`               | Today's date with time stripped              |
| `yesterday`           | Yesterday's date                             |
| `stripTime`           | Remove time component from a Date            |
| `getWeek`             | ISO week number                              |
| `msSinceDate`         | Milliseconds elapsed since a date            |
| `hasCooldownElapsed`  | Check if a cooldown period has passed        |
| `Timer`               | Returns a function that reports elapsed time |
| `daysToMs`            | Convert days to milliseconds                 |
| `hoursToMs`           | Convert hours to milliseconds                |
| `minutesToMs`         | Convert minutes to milliseconds              |
| `secondsToMs`         | Convert seconds to milliseconds              |
| `monthNameDa`         | Danish month name                            |
| `monthNameDaRelative` | Relative Danish month name                   |
