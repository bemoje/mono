import { DIST_PATH } from './constants'
import type { Resume } from './types/Resume'
import { entriesOf } from '@mono/object'
import fs from 'fs-extra'
import upath from 'upath'
import { userConfigFile } from './userConfigFile'

/**
 * Loads the resume JSON file and applies any user-defined ignore rules to filter out specific sections or entries.
 */
export async function loadResumeJson(options?: { applyIgnoreRules?: boolean }): Promise<Resume> {
  const resume = (await fs.readJson(upath.join(DIST_PATH, 'resume.json'))) as Resume

  const userConfig = userConfigFile.load()

  if (userConfig.ignore && options?.applyIgnoreRules !== false) {
    const ignore = userConfig.ignore
    const keys = ['work', 'education', 'projects', 'skills', 'languages', 'recommendations'] as const

    for (const section of keys) {
      const entries = resume[section]
      const rules = ignore[section]

      if (!rules || !entries) {
        continue
      }

      const filteredSection =
        rules === true
          ? undefined
          : entries.filter((item) => {
              return !rules.some((rule) => {
                return entriesOf(rule).every(([key, value]) => {
                  return item[key] === value
                })
              })
            })

      Reflect.set(resume, section, filteredSection)
    }
  }
  return resume
}
