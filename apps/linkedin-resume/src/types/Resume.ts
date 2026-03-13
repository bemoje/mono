/**
 * Current geographic location of the candidate, shown in the profile header.
 */
export interface ResumeLocation {
  /**
   * City of residence.
   */
  city: string
  /**
   * State, province, or region (e.g., 'Central Denmark Region').
   */
  region?: string
  /**
   * Country name or ISO country code (e.g., 'Denmark').
   */
  countryCode: string
}

/**
 * Link to a social media or professional profile, rendered as a button in the profile header.
 */
export interface ResumeSocial {
  /**
   * Display name of the platform (e.g., 'LinkedIn', 'GitHub').
   */
  network: string
  /**
   * Username or handle on the platform. Also used to construct URLs (e.g., LinkedIn recommendations link).
   */
  username: string
  /**
   * Full URL to the profile page.
   */
  url: string
}

/**
 * Core personal and contact details displayed in the profile header of the resume.
 */
export interface ResumeProfile {
  /**
   * Full name of the candidate.
   */
  name: string
  /**
   * Primary professional title or role, displayed as the headline beneath the name (e.g., 'Full Stack Software Developer').
   */
  headline: string
  image: string
  websites?: string[]

  /**
   * Primary contact email address.
   */
  email: string
  /**
   * Primary contact phone number, including country code (e.g., '+4525113899').
   */
  phone: string
  /**
   * Multiline 'About' text providing a brief overview of the candidate's background, expertise, and current focus. Newlines separate paragraphs in the rendered output.
   */
  summary?: string
  /**
   * A short list of top-level headline skills displayed as pills in the 'About' section. Keep this concise (3-5 items) to highlight key strengths. Distinct from the root-level 'skills' array, which is the comprehensive list.
   */
  topSkills?: string[]
  /**
   * Current geographic location of the candidate, shown in the profile header.
   */
  location: ResumeLocation
  /**
   * Links to social media and professional profiles, rendered as buttons in the profile header.
   */
  social: ResumeSocial[]
}

/**
 * Professional work experience entry. Consecutive entries with the same company name are automatically grouped under a single company heading with multiple sub-roles in the rendered output.
 */
export interface ResumeWork {
  /**
   * Company or organization name. Consecutive entries sharing the same name are grouped together visually.
   */
  name: string
  /**
   * Location of the role (e.g., 'Brande, Central Denmark Region, Denmark').
   */
  location?: string
  /**
   * Job title held at the company (e.g., 'Full Stack Software Developer').
   */
  position: string
  /**
   * Start date of the position in 'YYYY-MM' format (e.g., '2025-11').
   */
  startDate: string
  /**
   * End date of the position in 'YYYY-MM' format, or an empty string if the position is current (renders as 'Present').
   */
  endDate: string
  /**
   * Human-readable duration string (e.g., '2 yrs 4 mos').
   */
  duration?: string
  /**
   * Brief free-text description of the role. Rendered as a paragraph. Can be empty if highlights cover the role sufficiently.
   */
  summary?: string
  /**
   * Key accomplishments and responsibilities, rendered as a bulleted list.
   */
  highlights?: string[]
  /**
   * Technologies, tools, and competencies used in this role, rendered as skill pills.
   */
  skills?: string[]
  /**
   * Attached media items (images, documents, links) from the LinkedIn entry.
   */
  mediaLinks?: ResumeMediaLink[]
  /**
   * URL to the company logo image (typically a LinkedIn company logo). Falls back to a placeholder initial if empty.
   */
  logoUrl?: string
}

/**
 * Academic history entry.
 */
export interface ResumeEducation {
  /**
   * Name of the educational institution (e.g., 'Aarhus University').
   */
  name: string
  /**
   * Field of study or degree program (e.g., 'Computer Science (4 semesters)'). Can be empty for institutions where a specific program is not applicable.
   */
  area?: string
  /**
   * Type of degree or supplementary context about the program (e.g., 'Bachelor', 'Master'). Can be empty.
   */
  studyType?: string
  /**
   * Start date of the education in 'YYYY-MM-DD' or 'YYYY-MM' format.
   */
  startDate: string
  /**
   * End date of the education in 'YYYY-MM-DD' or 'YYYY-MM' format, or empty string if ongoing.
   */
  endDate: string
  /**
   * List of notable courses completed during the program, rendered as a comma-separated list.
   */
  courses?: string[]
  /**
   * Skills and technologies acquired during the education, rendered as skill pills.
   */
  skills?: string[]
  /**
   * Attached media items (images, documents, links) from the LinkedIn entry.
   */
  mediaLinks?: ResumeMediaLink[]
  /**
   * URL to the institution's logo image. Falls back to a placeholder initial if empty.
   */
  logoUrl?: string
}

/**
 * An external link related to a project (e.g., Spotify, demo sites), rendered as a link button.
 */
export interface ResumeMediaLink {
  /**
   * Display text for the link (e.g., 'GitHub - bemoje/mono', 'Spotify').
   */
  title: string
  /**
   * Full URL of the linked resource.
   */
  url: string
}

/**
 * Notable personal, open-source, or professional side project.
 */
export interface ResumeProject {
  /**
   * Name of the project.
   */
  name: string
  /**
   * Brief description of the project's purpose and scope.
   */
  description?: string
  /**
   * Key features or accomplishments, rendered as a bulleted list.
   */
  highlights?: string[]
  /**
   * Technologies and skills used in the project, rendered as skill pills.
   */
  skills?: string[]
  /**
   * Start date of the project in 'YYYY-MM' format.
   */
  startDate: string
  /**
   * End date of the project in 'YYYY-MM' format, or empty string if ongoing.
   */
  endDate: string
  /**
   * Roles held within the project (e.g., 'Lead Developer', 'Maintainer').
   */
  roles?: string[]
  /**
   * Company or organization the project is associated with, rendered as 'Associated with <entity>'. Empty for personal projects.
   */
  entity?: string
  /**
   * Category or type of project (e.g., 'Open Source', 'Internal Tool'). Can be empty.
   */
  type?: string
  /**
   * Primary URL for the project (e.g., GitHub repository). Can be empty.
   */
  url?: string
  /**
   * Additional external links related to the project (e.g., Spotify, demo sites), rendered as link buttons.
   */
  mediaLinks?: ResumeMediaLink[]
  /**
   * URL to a project logo or thumbnail image. Falls back to a placeholder initial if empty.
   */
  logoUrl?: string
}

/**
 * Spoken language and proficiency level.
 */
export interface ResumeLanguage {
  /**
   * Name of the language (e.g., 'Danish', 'English').
   */
  language: string
  /**
   * Proficiency level (e.g., 'Native or bilingual proficiency', 'Professional working proficiency').
   */
  fluency: string
}

/**
 * Professional recommendation received, typically from LinkedIn. Rendered with a link to the LinkedIn recommendations page.
 */
export interface ResumeRecommendation {
  /**
   * Full name of the person who gave the recommendation.
   */
  name: string
  /**
   * Professional headline or job title of the recommender (e.g., 'Delivery Director FO at Evidi').
   */
  headline: string
  /**
   * Date the recommendation was given, in human-readable format (e.g., 'June 13, 2025').
   */
  date: string
  /**
   * Professional relationship between the recommender and the candidate (e.g., 'Martin managed Benjamin directly').
   */
  relationship: string
  /**
   * URL to the recommender's profile photo. Falls back to a placeholder initial if empty.
   */
  logoUrl?: string
}

/**
 * Professional skill entry, typically scraped from LinkedIn. Rendered as a skill pill in the 'Skills' section. Distinct from 'basics.skills', which is only the top headline skills.
 */
export interface ResumeSkill {
  /**
   * Name of the skill (e.g., 'TypeScript', 'Docker', 'Project Management').
   */
  name: string
  /**
   * Contexts where the skill was demonstrated or acquired - work positions, education, projects, endorsements, or LinkedIn skill assessments.
   */
  associations?: string[]
}

/**
 * Structured resume data used to generate HTML resumes, cover letters, and fitness evaluations for job applications. Loosely based on the JSON Resume schema (https://jsonresume.org).
 */
export interface Resume {
  /**
   * Core personal and contact details displayed in the profile header of the resume.
   */
  basics: ResumeProfile
  /**
   * Professional work experience entries, ordered from most recent to oldest. Consecutive entries with the same company name are automatically grouped under a single company heading with multiple sub-roles in the rendered output.
   */
  work?: ResumeWork[]
  /**
   * Academic history entries, ordered from most recent to oldest.
   */
  education?: ResumeEducation[]
  /**
   * Notable personal, open-source, or professional side projects.
   */
  projects?: ResumeProject[]
  /**
   * Spoken languages and proficiency levels.
   */
  languages?: ResumeLanguage[]
  /**
   * Professional recommendations received, typically from LinkedIn. Rendered with a link to the LinkedIn recommendations page.
   */
  recommendations?: ResumeRecommendation[]
  /**
   * Comprehensive list of all professional skills, typically scraped from LinkedIn. Rendered as a flat list of skill pills in the 'Skills' section. Distinct from 'basics.skills', which is only the top headline skills.
   */
  skills?: ResumeSkill[]
}
