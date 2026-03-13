import { OptionsConfigurator } from '@mono/composition'
import { Type } from '@sinclair/typebox'

////////////

const PersonBuilder = OptionsConfigurator(
  {
    name: Type.String(),
    age: Type.Integer(),
    city: Type.String(),
    state: Type.String({
      default: () => {
        return 'N/A'
      },
    }),
    disabled: Type.Optional(Type.Boolean()),
  },
  ['state']
)

class Person extends PersonBuilder.createBaseClass() {
  override initialize() {
    this.assertValidOptions()
  }
  print() {
    // console.log({ [this.options.name]: this })
  }
}

new Person((o) => {
  return o
    .name('Alice') //
    .age(2)
    .city('Seattle')
    .done()
}).print()

new Person({
  name: 'Charlie', //
  age: 30,
  city: 'New York',
  disabled: false,
}).print()

const createPerson = PersonBuilder.createFunction((options) => {
  console.log('Creating person with options:', options)
})

createPerson((o) => {
  return o
    .name('Bob') //
    .age(25)
    .city('Los Angeles')

    .done()
})

createPerson({
  name: 'Dave', //
  age: 40,
  city: 'Chicago',
})

console.log(createPerson)

console.log(Person)
