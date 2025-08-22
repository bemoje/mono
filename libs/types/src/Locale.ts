import { TStringOfLength } from './TStringOfLength'

export type LocaleMonthNames<T extends string> = [
  Jan: T,
  Feb: T,
  Mar: T,
  Apr: T,
  May: T,
  Jun: T,
  Jul: T,
  Aug: T,
  Sep: T,
  Oct: T,
  Nov: T,
  Dec: T,
]

export type LocaleWeekDayNames<T extends string> = [Sun: T, Mon: T, Tue: T, Wed: T, Thu: T, Fri: T, Sat: T]

export type LocaleMonthFullNames = LocaleMonthNames<string>
export type LocaleMonthShortNames = LocaleMonthNames<TStringOfLength<string, 3>>
export type LocaleWeekDayFullNames = LocaleWeekDayNames<string>
export type LocaleWeekDayShortNames = LocaleWeekDayNames<TStringOfLength<string, 3>>

export interface LocalesMonths {
  months: LocaleMonthFullNames
  monthsShort: LocaleMonthShortNames
}
export interface LocalesWeeks {
  weekdays: LocaleWeekDayFullNames
  weekdaysShort: LocaleWeekDayShortNames
}
