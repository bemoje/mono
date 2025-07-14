import { StringTemplateStrategy, Template } from '@mono/template'
import { Type } from '@sinclair/typebox'

const addDependency = new Template({
  strategy: new StringTemplateStrategy(),
  optionsSchema: Type.Object({
    dependency: Type.String(),
  }),
  template: 'yarn add {{dependency}}',
})

const addDevDependency = new Template({
  strategy: new StringTemplateStrategy(),
  optionsSchema: Type.Object({
    dependency: Type.String(),
  }),
  template: 'yarn add {{dependency}} --dev',
})

const removeDependency = new Template({
  strategy: new StringTemplateStrategy(),
  optionsSchema: Type.Object({
    workspace: Type.String(),
    dependency: Type.String(),
  }),
  template: 'yarn workspace {{workspace}} remove {{dependency}}',
})

const openFileInIDE = new Template({
  strategy: new StringTemplateStrategy(),
  optionsSchema: Type.Object({
    filepath: Type.String(),
  }),
  template: 'code {{filepath}}',
})

export const commands = {
  addDependency,
  addDevDependency,
  removeDependency,
  openFileInIDE,
}
