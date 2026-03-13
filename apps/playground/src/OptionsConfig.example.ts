import { OptionsConfigurator } from '@mono/composition'
import { Type } from '@sinclair/typebox'

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
  return o
    .name('Alice') //
    .age(2)
    .city('Seattle')
    .done()
})

console.log(options)
