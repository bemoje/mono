import { beforeEach } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { formatAsStringTable } from './formatAsStringTable'
import { format } from 'date-fns'
import startCase from 'lodash/startCase'

describe('formatAsStringTable', () => {
  type Input = {
    season: string
    qty: number
    date: Date
    active?: boolean
  }

  const data = [
    {
      season: 'season1',
      qty: 1000,
      date: new Date('2020-02-10'),
      active: true,
    },
    {
      season: 'season2',
      qty: 5000,
      date: new Date('2020-02-15'),
      active: false,
    },
    {
      season: 'season3',
      qty: 5000,
      date: new Date('2020-02-20'),
      active: true,
    },
  ]
  const spy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks
  })

  it('should format number props as string using the correct formatter', () => {
    type Output = {
      season: string
      qty: string
    }

    spy.mockImplementation((value: number) => {
      return value.toLocaleString('da-DK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    })
    const stringData = formatAsStringTable<Input, Output>({
      data,
      stringFormatters: [
        {
          key: 'qty',
          format: spy,
        },
      ],
    })
    const sorted = stringData.sort((a, b) => a.season.localeCompare(b.season))
    expect(sorted).toEqual([
      {
        season: 'season1',
        qty: '1.000',
      },
      {
        season: 'season2',
        qty: '5.000',
      },
      {
        season: 'season3',
        qty: '5.000',
      },
    ])
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('should format date props as string using the correct formatter', () => {
    type Output = {
      season: string
      date: string
    }
    spy.mockImplementation((value: Date) => {
      return format(value, 'dd')
    })
    const stringData = formatAsStringTable<Input, Output>({
      data,
      stringFormatters: [
        {
          key: 'date',
          format: spy,
        },
      ],
    })
    const sorted = stringData.sort((a, b) => a.season.localeCompare(b.season))
    expect(sorted).toEqual([
      {
        season: 'season1',
        date: '10',
      },
      {
        season: 'season2',
        date: '15',
      },
      {
        season: 'season3',
        date: '20',
      },
    ])
  })

  it('should format boolean props as string using the correct formatter', () => {
    type Output = {
      season: string
      active: string
    }
    spy.mockImplementation((value: boolean) => {
      return value ? 'Yes' : 'No'
    })
    const stringData = formatAsStringTable<Input, Output>({
      data,
      stringFormatters: [
        {
          key: 'active',
          format: spy,
        },
      ],
    })
    const sorted = stringData.sort((a, b) => a.season.localeCompare(b.season))
    expect(sorted).toEqual([
      {
        season: 'season1',
        active: 'Yes',
      },
      {
        season: 'season2',
        active: 'No',
      },
      {
        season: 'season3',
        active: 'Yes',
      },
    ])
  })

  it('should format string props as string using the correct formatter', () => {
    type Output = {
      season: string
      description: string
    }
    spy.mockImplementation((value: string) => {
      return startCase(value)
    })

    type ExtendedInput = Input & { description: string }
    const extendedData: ExtendedInput[] = data.map((obj) => ({
      ...obj,
      description: obj.season,
    }))

    const stringData = formatAsStringTable<ExtendedInput, Output>({
      data: extendedData,
      stringFormatters: [
        {
          key: 'description',
          format: spy,
        },
      ],
    })
    const sorted = stringData.sort((a, b) => a.season.localeCompare(b.season))
    expect(sorted).toEqual([
      {
        season: 'season1',
        description: 'Season 1',
      },
      {
        season: 'season2',
        description: 'Season 2',
      },
      {
        season: 'season3',
        description: 'Season 3',
      },
    ])
  })

  it('should use a default formatter', () => {
    interface Input {
      season: string
      [yearMonth: string]: string | number
    }
    interface Output {
      season: string
      [yearMonth: string]: string
    }

    const data: Input[] = [
      {
        'season': 'season1',
        '2020-01': 100,
        '2020-02': 200,
      },
      {
        'season': 'season2',
        '2020-01': 400,
        '2020-02': 300,
      },
    ]

    const stringData = formatAsStringTable<Input, Output>({
      data,
      stringFormatters: [],
      defaultFormatter: {
        format: (value) => {
          if (typeof value === 'string') return value
          return value.toString(10)
        },
      },
    })

    const sorted = stringData.sort((a, b) => a.season.localeCompare(b.season))
    expect(sorted).toEqual([
      {
        'season': 'season1',
        '2020-01': '100',
        '2020-02': '200',
      },
      {
        'season': 'season2',
        '2020-01': '400',
        '2020-02': '300',
      },
    ])
  })
})
