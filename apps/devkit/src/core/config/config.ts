import { ConfigFile } from '@mono/config'
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { repoRootPath } from '../constants/paths'
import { templates } from '../templates/templates'
import upath from 'upath'

export const ConfigSchema = Type.Object(
  {
    templates: Type.Object(
      {
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
      },
      {
        default: {
          commands: {},
          files: {},
        },
      },
    ),
  },
  {
    default: {
      templates: {
        commands: {},
        files: {},
      },
    },
  },
)

export type ConfigSchema = Static<typeof ConfigSchema>
export const dataPath = upath.join(repoRootPath, 'devkit.config.json')
export const configFile = new ConfigFile(ConfigSchema, dataPath)
