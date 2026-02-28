import { DIST_PATH } from './constants'
import type { Logger } from '@mono/node'
import type { Resume } from './types/Resume'
import type { ResumeEducation } from './types/Resume'
import type { ResumeLanguage } from './types/Resume'
import type { ResumeProfile } from './types/Resume'
import type { ResumeProject } from './types/Resume'
import type { ResumeRecommendation } from './types/Resume'
import type { ResumeSkill } from './types/Resume'
import type { ResumeWork } from './types/Resume'
import fs from 'fs-extra'
import { scrapeReadJson } from './linkedin/utils/scrapeReadJson'
import upath from 'upath'

export async function renderResumeJson(logger: Logger): Promise<void> {
  const education = await scrapeReadJson<ResumeEducation[]>('education')
  const work = await scrapeReadJson<ResumeWork[]>('experience')
  const projects = await scrapeReadJson<ResumeProject[]>('projects')
  const skills = await scrapeReadJson<ResumeSkill[]>('skills')
  const recommendations = await scrapeReadJson<ResumeRecommendation[]>('recommendations')
  const languages = await scrapeReadJson<ResumeLanguage[]>('languages')
  const profile = await scrapeReadJson<ResumeProfile>('profile')

  const resume: Resume = {
    basics: profile,
    work,
    education,
    projects,
    languages,
    recommendations,
    skills,
  }

  // render dist html resume
  const distResumeJsonPath = upath.joinSafe(DIST_PATH, 'resume.json')
  await fs.outputJson(distResumeJsonPath, resume, { spaces: 2 })
  logger.log(distResumeJsonPath)
}
