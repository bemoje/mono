import { ConfigFile } from '@mono/config'
import { Type } from '@sinclair/typebox'
import { CONFIG_PATH } from './constants'
import { UserConfig } from './types/UserConfig'

export const UserConfigSchema = Type.Object(
  {
    username: Type.String({ default: '' }),
    outpath: Type.String({ default: '$USERPROFILE/Desktop/resume.pdf' }),
    social: Type.Array(
      Type.Object({
        network: Type.String({ default: '' }),
        username: Type.String({ default: '' }),
        url: Type.String({ default: '' }),
      }),
      {
        default: [],
      },
    ),
    ignore: Type.Optional(
      Type.Object(
        {
          work: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  name: Type.Optional(Type.String()),
                  location: Type.Optional(Type.String()),
                  position: Type.Optional(Type.String()),
                  startDate: Type.Optional(Type.String()),
                  endDate: Type.Optional(Type.String()),
                  duration: Type.Optional(Type.String()),
                  summary: Type.Optional(Type.String()),
                  logoUrl: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
          education: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  name: Type.Optional(Type.String()),
                  area: Type.Optional(Type.String()),
                  studyType: Type.Optional(Type.String()),
                  startDate: Type.Optional(Type.String()),
                  endDate: Type.Optional(Type.String()),
                  logoUrl: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
          projects: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  name: Type.Optional(Type.String()),
                  description: Type.Optional(Type.String()),
                  startDate: Type.Optional(Type.String()),
                  endDate: Type.Optional(Type.String()),
                  entity: Type.Optional(Type.String()),
                  type: Type.Optional(Type.String()),
                  url: Type.Optional(Type.String()),
                  logoUrl: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
          skills: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  name: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
          languages: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  language: Type.Optional(Type.String()),
                  fluency: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
          recommendations: Type.Optional(
            Type.Union([
              Type.Literal(true),
              Type.Array(
                Type.Object({
                  name: Type.Optional(Type.String()),
                  headline: Type.Optional(Type.String()),
                  date: Type.Optional(Type.String()),
                  relationship: Type.Optional(Type.String()),
                  logoUrl: Type.Optional(Type.String()),
                }),
                {
                  default: [],
                },
              ),
            ]),
          ),
        },
        {
          default: {},
        },
      ),
    ),
  },
  {
    default: {},
  },
)

export const userConfigFile = new ConfigFile(UserConfigSchema, CONFIG_PATH)

// ensure UserConfig type is same as schema
const _: UserConfig = userConfigFile.load()

//

// import { Value } from '@sinclair/typebox/value'
// console.dir(Value.Default(UserConfigSchema, undefined), { depth: null })
