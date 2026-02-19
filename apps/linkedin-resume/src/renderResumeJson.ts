import fs from 'fs-extra'
import upath from 'upath'
import { DIST_PATH } from './constants'
import {
  Resume,
  ResumeEducation,
  ResumeLanguage,
  ResumeProfile,
  ResumeProject,
  ResumeRecommendation,
  ResumeSkill,
  ResumeWork,
} from './types/Resume'
import { scrapeReadJson } from './linkedin/utils/scrapeReadJson'
import { Logger } from '@mono/node'

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
