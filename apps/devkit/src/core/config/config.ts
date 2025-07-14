import path from '@mono/path'
import templates from '../templates/templates'
import { ConfigFile } from '@mono/config'
import { repoRootPath } from '../constants/paths'
import { Static, Type } from '@sinclair/typebox'

export const ConfigSchema = Type.Object({
  templates: Type.Object({
    commands: Type.Object({
      openFileInIDE: templates.commands.openFileInIDE.createSchema(),
      addDependency: templates.commands.addDependency.createSchema(),
      addDevDependency: templates.commands.addDevDependency.createSchema(),
      removeDependency: templates.commands.removeDependency.createSchema(),
    }),
    files: Type.Object({
      eslintConfigJs: templates.files.eslintConfigJs.createSchema(),
      packageJson: templates.files.packageJson.createSchema(),
      esbuild: templates.files.esbuild.createSchema(),
      readmeMd: templates.files.readmeMd.createSchema(),
      tsconfigJson: templates.files.tsconfigJson.createSchema(),
      indexTs: templates.files.indexTs.createSchema(),
    }),
  }),
})

export type ConfigSchema = Static<typeof ConfigSchema>
export const dataPath = path.join(repoRootPath, 'repo.config.json')
export const configFile = new ConfigFile(ConfigSchema, dataPath)
export const config = configFile.load()
