import fs from 'fs-extra'
import upath from 'upath'
import { loadUserConfig } from './loadUserConfig'
import { DIST_PATH } from './constants'
import {
  Resume,
  ResumeEducation,
  ResumeLanguage,
  ResumeLocation,
  ResumeProfile,
  ResumeProject,
  ResumeRecommendation,
  ResumeSkill,
  ResumeWork,
} from './types/Resume'

export async function renderResumeJson(): Promise<void> {
  const education = (await fs.readJson(upath.joinSafe(DIST_PATH, 'education-scraped.json'))) as ResumeEducation[]
  const work = (await fs.readJson(upath.joinSafe(DIST_PATH, 'work-scraped.json'))) as ResumeWork[]
  const projects = (await fs.readJson(upath.joinSafe(DIST_PATH, 'projects-scraped.json'))) as ResumeProject[]
  const skills = (await fs.readJson(upath.joinSafe(DIST_PATH, 'skills-scraped.json'))) as ResumeSkill[]
  const recommendations = (await fs.readJson(
    upath.joinSafe(DIST_PATH, 'recommendations-scraped.json'),
  )) as ResumeRecommendation[]
  const profile = (await fs.readJson(upath.joinSafe(DIST_PATH, 'profile-scraped.json'))) as {
    name: string
    image: string
    label: string
    url: string
    location: ResumeLocation
    email: string
    phone: string
    websites: string[]
    profiles: ResumeProfile[]
    summary: string
    languages: ResumeLanguage[]
    skills: string[]
  }
  const userConfig = await loadUserConfig()

  if (!userConfig.profiles) {
    userConfig.profiles = []
  }
  if (!userConfig.profiles.some((p: { network: string }) => p.network.toLowerCase() === 'linkedin')) {
    userConfig.profiles.push({
      network: 'LinkedIn',
      username: userConfig.username,
      url: `https://www.linkedin.com/in/${userConfig.username}`,
    })
  }

  const basics = {
    name: profile.name,
    image: profile.image,
    label: profile.label,
    email: profile.email,
    phone: profile.phone,
    url: profile.url,
    websites: profile.websites,
    summary: profile.summary,
    skills: profile.skills,
    location: profile.location,
    profiles: userConfig.profiles,
  }

  const languages = profile.languages

  const resume: Resume = {
    basics,
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
  console.log('output:', distResumeJsonPath)
}
