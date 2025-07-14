import {
  JsonFileTemplateStrategy,
  StringTemplateStrategy,
  Template,
  TextFileTemplateStrategy,
} from '@mono/template'
import { Type } from '@sinclair/typebox'

stringTemplate()
textFileTemplate()
jsonFileTemplate()

function stringTemplate() {
  const template = new Template({
    strategy: new StringTemplateStrategy(),
    optionsSchema: Type.Object({
      name: Type.String(),
      age: Type.Optional(Type.String({ default: '18' })),
    }),
    template: 'Hello, my name is {{name}} and I am {{age}} years old.',
  })

  console.log(template.render({ name: 'John' }))
  console.log(template.render({ name: 'John', age: '25' }))
}

function textFileTemplate() {
  const template = new Template({
    strategy: new TextFileTemplateStrategy(),
    optionsSchema: Type.Object({
      name: Type.String(),
      age: Type.Optional(Type.String({ default: '18' })),
    }),
    template: [
      'Hello, my name is {{name}}.', //
      'I am {{age}} years old.',
    ],
  })

  console.log(template.render({ name: 'John' }))
  console.log(template.render({ name: 'John', age: '25' }))
}

function jsonFileTemplate() {
  const template = new Template({
    strategy: new JsonFileTemplateStrategy(),
    optionsSchema: Type.Object({
      name: Type.String(),
      age: Type.Optional(Type.String({ default: '18' })),
    }),
    template: {
      person: {
        name: '{{name}}',
        age: '{{age}}',
      },
    },
  })

  console.log(template.render({ name: 'John' }))
  console.log(template.render({ name: 'John', age: '25' }))
}
