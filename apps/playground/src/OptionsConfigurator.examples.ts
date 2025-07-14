import { OptionsConfigurator } from '@mono/object'
import { Type } from '@sinclair/typebox'

////////////

example1()
// example2()

////////////

function example1() {
  const props = {
    name: Type.String(),
    age: Type.Integer(),
    city: Type.String(),
    state: Type.Optional(Type.String({ default: () => 'WA' })),
    disabled: Type.Optional(Type.Boolean()),
  }

  const configurator = OptionsConfigurator(props)

  const options = configurator((o) => {
    return o
      .name('Alice') //
      .age(2)
      .city('Seattle')
      .done()
  })

  console.log(options)
  //=> { state: 'WA', name: 'Alice', age: 2, city: 'Seattle' }

  console.log(configurator)
  console.log(configurator.getSchemaProps())
  console.log(configurator.getSchema())
  console.log(configurator.getDefaults())
}

////////////

function example2() {
  const PersonConfigurator = OptionsConfigurator({
    name: Type.String(),
    age: Type.Integer(),
    city: Type.String(),
    state: Type.Optional(Type.String({ default: () => 'WA' })),
    disabled: Type.Optional(Type.Boolean()),
  })

  class Person {
    constructor(readonly options: ReturnType<typeof PersonConfigurator.cast>) {}

    static Configurator(...args: Parameters<typeof PersonConfigurator>) {
      return new this(PersonConfigurator(...args))
    }
  }

  console.log([
    Person.Configurator((o) => {
      return o
        .name('Alice') //
        .age(2)
        .city('Seattle')
        .done()
    }),

    Person.Configurator((o) => {
      return o
        .name('Bob') //
        .age(16)
        .city('New York')
        .state('NY')
        .disabled(true)
        .done()
    }),
  ])
}
