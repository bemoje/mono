import { OptionsConfigurator } from './OptionsConfigurator'
import { Type } from '@sinclair/typebox'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(OptionsConfigurator.name, () => {
  it('should configure options with required and optional fields', () => {
    const props = {
      name: Type.String(),
      age: Type.Integer(),
      city: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'WA'
          },
        }),
      ),
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
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'CA'
          },
        }),
      ),
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
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'CA'
          },
        }),
      ),
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

  it('should accept a TObject schema instead of plain props', () => {
    const schema = Type.Object({
      name: Type.String(),
      count: Type.Optional(Type.Integer({ default: 5 })),
    })

    const configurator = OptionsConfigurator(schema)

    const options = configurator((o) => {
      return o.name('test').done()
    })

    expect(options).toEqual({ name: 'test', count: 5 })
  })

  it('should expose getSchemaProps', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    const schemaProps = configurator.getSchemaProps()
    expect(schemaProps).toHaveProperty('name')
  })

  it('should expose getSchema', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    const schema = configurator.getSchema()
    expect(schema).toHaveProperty('type', 'object')
    expect(schema.properties).toHaveProperty('name')
  })

  it('should expose getDefaults', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'WA'
          },
        }),
      ),
    }
    const configurator = OptionsConfigurator(props)
    const defaults = configurator.getDefaults()
    expect(defaults).toHaveProperty('state')
    expect(typeof defaults.state).toBe('function')
    expect(defaults.state!()).toBe('WA')
  })

  it('should expose cast', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    const val = configurator.cast({ name: 'hi' })
    expect(val).toEqual({ name: 'hi' })
  })

  it('should expose getCreate', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    const create = configurator.getCreate()
    expect(typeof create).toBe('function')
    const builder = create()
    expect(builder).toHaveProperty('name')
    expect(builder).toHaveProperty('done')
  })

  it('should expose getBuild', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    const build = configurator.getBuild()
    expect(build).toBe(configurator)
  })

  it('should handle passing undefined to an accessor with default (triggers default)', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'CA'
          },
        }),
      ),
    }
    const configurator = OptionsConfigurator(props)
    const create = configurator.getCreate()
    const builder = create()
    // Pass undefined to state accessor - should apply the default
    const next = (builder as any).state(undefined)
    const result = next.name('Alice').done()
    expect(result.state).toBe('CA')
  })

  it('should handle passing undefined to an accessor without default (deletes key)', () => {
    const props = {
      name: Type.String(),
      tag: Type.Optional(Type.String()),
    }
    const configurator = OptionsConfigurator(props)
    const create = configurator.getCreate()
    const builder = create()
    // Set tag then unset it by passing undefined
    const next = (builder as any).tag('hello')
    const next2 = (next as any).tag(undefined)
    const result = next2.name('Alice').done()
    expect(result.tag).toBeUndefined()
    expect('tag' in result).toBe(false)
  })

  it('should handle a non-function default value', () => {
    const props = {
      name: Type.String(),
      count: Type.Optional(Type.Integer({ default: 42 })),
    }
    const configurator = OptionsConfigurator(props)
    const options = configurator((o) => {
      return o.name('test').done()
    })
    expect(options.count).toBe(42)
  })

  it('should handle $data property access without done()', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'WA'
          },
        }),
      ),
    }
    const configurator = OptionsConfigurator(props)
    const create = configurator.getCreate()
    const builder = create()
    const next = (builder as any).name('Alice')
    // $data gives raw data without applying defaults
    expect(next.$data).toEqual({ name: 'Alice' })
  })

  it('should handle applyDefaults skipping undefined defaults', () => {
    const props = {
      name: Type.String(),
      tag: Type.Optional(Type.String()),
    }
    const configurator = OptionsConfigurator(props)
    const options = configurator((o) => {
      return o.name('test').done()
    })
    // tag has no default, so it should not appear
    expect(options).toEqual({ name: 'test' })
    expect('tag' in options).toBe(false)
  })
})
