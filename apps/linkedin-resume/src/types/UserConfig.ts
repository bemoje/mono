import {
  ResumeEducation,
  ResumeLanguage,
  ResumeRecommendation,
  ResumeWork,
  ResumeProject,
  ResumeSkill,
  ResumeSocial,
} from './Resume'
import { PickPrimitive } from '@mono/types'

export interface UserConfig {
  /**
   * LinkedIn username, used to construct profile URLs and links to recommendations. Also serves as a unique identifier for the candidate. Required for LinkedIn scraping and rendering accurate profile links in the resume.
   */
  username: string

  /**
   * Filepath where the generated PDF resume will be saved. Supports environment variables (e.g., $USERPROFILE) which will be expanded to their actual values. The directory will be created if it does not exist. Defaults to: "$USERPROFILE/Desktop/resume.pdf".
   */
  outpath: string

  /**
   * Additional profiles to include in the resume, such as GitHub, Twitter, etc. Each profile should specify the network name, username, and URL. These will be rendered in the contact section of the resume and can also be used to link to projects or other relevant information.
   */
  social: ResumeSocial[]

  /**
   * Defines which entries to omit for each section of the resume when rendering.
   */
  ignore?: UserConfigIgnore
}

/**
 * Defines which entries to omit for each section of the resume when rendering.
 */
export interface UserConfigIgnore {
  /**
   * If set to true, all work entries will be ignored. If set to an array of partial objects, only work entries matching the specified primitive values (e.g., name, position) will be ignored.
   */
  work?: true | Partial<PickPrimitive<ResumeWork>>[]
  /**
   * If set to true, all education entries will be ignored. If set to an array of partial objects, only education entries matching the specified primitive values (e.g., name, area) will be ignored.
   */
  education?: true | Partial<PickPrimitive<ResumeEducation>>[]
  /**
   * If set to true, all project entries will be ignored. If set to an array of partial objects, only project entries matching the specified primitive values (e.g., name, description) will be ignored.
   */
  projects?: true | Partial<PickPrimitive<ResumeProject>>[]
  /**
   * If set to true, all skill entries will be ignored. If set to an array of partial objects, only skill entries matching the specified primitive values (e.g., name, level) will be ignored.
   */
  skills?: true | Partial<PickPrimitive<ResumeSkill>>[]
  /**
   * If set to true, all language entries will be ignored. If set to an array of partial objects, only language entries matching the specified primitive values (e.g., language, fluency) will be ignored.
   */
  languages?: true | Partial<PickPrimitive<ResumeLanguage>>[]
  /**
   * If set to true, all recommendation entries will be ignored. If set to an array of partial objects, only recommendation entries matching the specified primitive values (e.g., name, headline) will be ignored.
   */
  recommendations?: true | Partial<PickPrimitive<ResumeRecommendation>>[]
}
