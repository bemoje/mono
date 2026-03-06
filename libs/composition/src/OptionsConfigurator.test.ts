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
        })
      ),
      disabled: Type.Optional(Type.Boolean()),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Alice').age(30).city('Seattle').done()
    })

    expect(options).toEqual({ name: 'Alice', age: 30, city: 'Seattle', state: 'WA' })
  })

  it('should apply default values for optional fields', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'CA'
          },
        })
      ),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Bob').done()
    })

    expect(options).toEqual({ name: 'Bob', state: 'CA' })
  })

  it('should allow overriding default values for optional fields', () => {
    const props = {
      name: Type.String(),
      state: Type.Optional(
        Type.String({
          default: () => {
            return 'CA'
          },
        })
      ),
    }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Charlie').state('NY').done()
    })

    expect(options).toEqual({ name: 'Charlie', state: 'NY' })
  })

  it('should handle empty optional fields', () => {
    const props = { name: Type.String(), disabled: Type.Optional(Type.Boolean()) }

    const configurator = OptionsConfigurator(props)

    const options = configurator((o) => {
      return o.name('Dana').done()
    })

    expect(options).toEqual({ name: 'Dana' })
  })

  it('should accept a TObject schema instead of plain props', () => {
    const schema = Type.Object({ name: Type.String(), count: Type.Optional(Type.Integer({ default: 5 })) })

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
        })
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
        })
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
    const props = { name: Type.String(), tag: Type.Optional(Type.String()) }
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
    const props = { name: Type.String(), count: Type.Optional(Type.Integer({ default: 42 })) }
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
        })
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
    const props = { name: Type.String(), tag: Type.Optional(Type.String()) }
    const configurator = OptionsConfigurator(props)
    const options = configurator((o) => {
      return o.name('test').done()
    })
    // tag has no default, so it should not appear
    expect(options).toEqual({ name: 'test' })
    expect('tag' in options).toBe(false)
  })

  it('should expose getDefaultKeys', () => {
    const props = {
      name: Type.String(),
      state: Type.String({
        default: () => {
          return 'WA'
        },
      }),
    }
    const configurator = OptionsConfigurator(props, ['state'])
    expect(configurator.getDefaultKeys()).toEqual(['state'])
  })

  it('should return undefined for getDefaultKeys when not provided', () => {
    const props = { name: Type.String() }
    const configurator = OptionsConfigurator(props)
    expect(configurator.getDefaultKeys()).toBeUndefined()
  })

  describe('createFunction', () => {
    it('should create a function that accepts a builder callback', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return `${options.name} is ${options.age}`
      })
      const result = fn((o) => {
        return o.name('Alice').age(30).done()
      })
      expect(result).toBe('Alice is 30')
    })

    it('should create a function that accepts plain options', () => {
      const props = { name: Type.String(), count: Type.Optional(Type.Integer({ default: 5 })) }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return { name: options.name, count: options.count }
      })
      const result = fn({ name: 'test' })
      expect(result).toEqual({ name: 'test', count: 5 })
    })

    it('should apply Value.Default when plain options are passed', () => {
      const props = { name: Type.String(), state: Type.Optional(Type.String({ default: 'WA' })) }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return options
      })
      const result = fn({ name: 'test' })
      expect(result).toEqual({ name: 'test', state: 'WA' })
    })

    it('should preserve function name', () => {
      const props = { name: Type.String() }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction(function myFunc(options) {
        return options
      })
      expect(fn.name).toBe('myFunc')
    })

    it('should expose OptionsConfigurator property', () => {
      const props = { name: Type.String() }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return options
      })
      expect(fn.OptionsConfigurator).toBe(configurator)
    })

    it('should throw on invalid options', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return options
      })
      expect(() => {
        fn({ name: 'test' } as any)
      }).toThrow()
    })

    it('should validate builder callback results', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const fn = configurator.createFunction((options) => {
        return options
      })
      expect(() => {
        fn((o) => {
          return o.name('test').done() as any
        })
      }).toThrow()
    })
  })

  describe('createBaseClass', () => {
    it('should create a class that accepts builder callback', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      const instance = new Base((o) => {
        return o.name('Alice').age(30).done()
      })
      expect(instance.options).toEqual({ name: 'Alice', age: 30 })
    })

    it('should create a class that accepts plain options', () => {
      const props = { name: Type.String(), count: Type.Optional(Type.Integer({ default: 5 })) }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      const instance = new Base({ name: 'test' })
      expect(instance.options).toEqual({ name: 'test', count: 5 })
    })

    it('should expose static OptionsConfigurator property', () => {
      const props = { name: Type.String() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      expect(Base.OptionsConfigurator).toBe(configurator)
    })

    it('should call initialize in constructor', () => {
      const props = { name: Type.String() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      let initialized = false
      class Sub extends Base {
        override initialize() {
          initialized = true
        }
      }
      new Sub({ name: 'test' })
      expect(initialized).toBe(true)
    })

    it('should have isValidOptions method', () => {
      const props = { name: Type.String() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      const instance = new Base({ name: 'test' })
      expect(instance.isValidOptions()).toBe(true)
    })

    it('should throw on invalid options via assertValidOptions', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()
      expect(() => {
        new Base({ name: 'test' } as any)
      }).toThrow()
    })

    it('should support subclassing', () => {
      const props = { name: Type.String(), age: Type.Integer() }
      const configurator = OptionsConfigurator(props)
      const Base = configurator.createBaseClass()

      class Person extends Base {
        greet() {
          return `Hi, I'm ${this.options.name}`
        }
      }

      const person = new Person((o) => {
        return o.name('Bob').age(25).done()
      })
      expect(person.greet()).toBe("Hi, I'm Bob")
      expect(person.options).toEqual({ name: 'Bob', age: 25 })
    })
  })

  describe('defaultKeys parameter', () => {
    it('should allow omitting defaultKeys from plain options', () => {
      const props = {
        name: Type.String(),
        age: Type.Integer(),
        state: Type.String({
          default: () => {
            return 'WA'
          },
        }),
      }
      const configurator = OptionsConfigurator(props, ['state'])
      const fn = configurator.createFunction((options) => {
        return options
      })
      // state has a default and is listed in defaultKeys, so it can be omitted
      const result = fn({ name: 'test', age: 10 })
      expect(result).toEqual({ name: 'test', age: 10, state: 'WA' })
    })

    it('should allow builder usage with defaultKeys', () => {
      const props = {
        name: Type.String(),
        city: Type.String({
          default: () => {
            return 'Seattle'
          },
        }),
      }
      const configurator = OptionsConfigurator(props, ['city'])
      const result = configurator((o) => {
        return o.name('Alice').done()
      })
      expect(result).toEqual({ name: 'Alice', city: 'Seattle' })
    })
  })
})
