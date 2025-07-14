import { describe, it, expect } from 'vitest'
import { Type } from '@sinclair/typebox'
import { OptionsConfigurator } from './OptionsConfigurator'

describe(OptionsConfigurator.name, () => {
  it('should configure options with required and optional fields', () => {
    const props = {
      name: Type.String(),
      age: Type.Integer(),
      city: Type.String(),
      state: Type.Optional(Type.String({ default: () => 'WA' })),
      disabled: Type.Optional(Type.Boolean()),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Alice').age(30).city('Seattle').done()
    })

    expect(options).toEqual({
      name: 'Alice',
      age: 30,
      city: 'Seattle',
      state: 'WA',
    })
  })

  it('should apply default values for optional fields', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(Type.String({ default: () => 'CA' })),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Bob').done()
    })

    expect(options).toEqual({
      name: 'Bob',
      state: 'CA',
    })
  })

  it('should allow overriding default values for optional fields', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(Type.String({ default: () => 'CA' })),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Charlie').state('NY').done()
    })

    expect(options).toEqual({
      name: 'Charlie',
      state: 'NY',
    })
  })

  it('should handle empty optional fields', () => {
    const props = {
      name: Type.String(),
      disabled: Type.Optional(Type.Boolean()),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Dana').done()
    })

    expect(options).toEqual({
      name: 'Dana',
    })
  })
})
