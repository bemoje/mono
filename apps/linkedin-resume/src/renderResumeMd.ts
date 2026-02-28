import { DIST_PATH } from './constants'
import type { Logger } from '@mono/node'
import type { Resume } from './types/Resume'
import type { ResumeWork } from './types/Resume'
import fs from 'fs-extra'
import { loadResumeJson } from './LoadResumeJson'
import upath from 'upath'
import { userConfigFile } from './userConfigFile'

export async function renderResumeMd(logger: Logger): Promise<void> {
  const resume = await loadResumeJson({ applyIgnoreRules: false })

  const sections: string[] = []
  sections.push(renderProfile(resume))
  sections.push(renderAbout(resume))
  sections.push(renderExperience(resume))
  sections.push(renderEducation(resume))
  sections.push(renderProjects(resume))
  sections.push(renderLanguages(resume))
  sections.push(renderRecommendations(resume))
  sections.push(renderSkills(resume))

  const md = `${sections.filter(Boolean).join('\n\n---\n\n')}\n`

  const outPath = upath.join(DIST_PATH, 'resume.md')
  await fs.outputFile(outPath, md)
  logger.log(outPath)
}

function renderProfile(resume: Resume): string {
  const b = resume.basics
  const loc = b.location
  const locationStr = [loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ')
  const lines: string[] = []

  lines.push(`# ${b.name}`)
  lines.push('')
  lines.push(`**${b.headline}**`)
  lines.push('')
  if (b.image) {
    lines.push(`![${b.name}](${b.image})`)
    lines.push('')
  }
  lines.push(`${locationStr}`)
  lines.push('')

  const contact: string[] = []
  if (b.email) {
    contact.push(`[${b.email}](mailto:${b.email})`)
  }
  if (b.phone) {
    contact.push(`[${b.phone}](tel:${b.phone})`)
  }
  if (contact.length) {
    lines.push(contact.join(' | '))
    lines.push('')
  }

  if (b.social?.length) {
    lines.push(
      b.social
        .map((p) => {
          return `[${p.network}](${p.url})`
        })
        .join(' | '),
    )
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

function renderAbout(resume: Resume): string {
  if (!resume.basics.summary) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## About`)
  lines.push('')
  lines.push(resume.basics.summary)
  if (resume.basics.topSkills?.length) {
    lines.push('')
    lines.push(
      resume.basics.topSkills
        .map((s) => {
          return `\`${s}\``
        })
        .join(' - '),
    )
  }
  return lines.join('\n').trimEnd()
}

interface ExperienceGroup {
  company: string
  roles: ResumeWork[]
}

function renderExperience(resume: Resume): string {
  if (!resume.work?.length) {
    return ''
  }

  // Group consecutive entries by company
  const groups: ExperienceGroup[] = []
  for (const job of resume.work) {
    const last = groups[groups.length - 1]
    if (last && last.company === job.name) {
      last.roles.push(job)
    } else {
      groups.push({ company: job.name, roles: [job] })
    }
  }

  const lines: string[] = []
  lines.push(`## Experience`)
  lines.push('')
  lines.push(
    groups
      .map((g) => {
        return renderExperienceGroup(g)
      })
      .join('\n\n'),
  )
  return lines.join('\n').trimEnd()
}

function renderExperienceGroup(group: ExperienceGroup): string {
  if (group.roles.length === 1) {
    const job = group.roles[0]
    const lines: string[] = []
    lines.push(`### ${job.position}`)
    lines.push('')
    lines.push(`**${job.name}**${job.location ? ` - ${job.location}` : ''}`)
    lines.push('')
    lines.push(`${formatDateRange(job.startDate, job.endDate)}${job.duration ? ` - ${job.duration}` : ''}`)
    lines.push(renderJobBody(job))
    return lines.join('\n').trimEnd()
  }

  // Grouped multi-role
  const first = group.roles[0]
  const last = group.roles[group.roles.length - 1]
  const lines: string[] = []
  lines.push(`### ${group.company}`)
  lines.push('')
  lines.push(`${formatDateRange(last.startDate, first.endDate)}`)
  lines.push('')
  lines.push(
    group.roles
      .map((job) => {
        return renderSubRole(job)
      })
      .join('\n\n'),
  )
  return lines.join('\n').trimEnd()
}

function renderSubRole(job: ResumeWork): string {
  const lines: string[] = []
  lines.push(`#### ${job.position}`)
  lines.push('')
  lines.push(`${formatDateRange(job.startDate, job.endDate)}${job.duration ? ` - ${job.duration}` : ''}`)
  if (job.location) {
    lines.push('')
    lines.push(job.location)
  }
  lines.push(renderJobBody(job))
  return lines.join('\n').trimEnd()
}

function renderJobBody(job: ResumeWork): string {
  const lines: string[] = []
  if (job.summary) {
    lines.push('')
    lines.push(job.summary)
  }
  if (job.highlights?.length) {
    lines.push('')
    for (const h of job.highlights) {
      lines.push(`- ${h}`)
    }
  }
  if (job.skills?.length) {
    const names = job.skills.map((s) => {
      return typeof s === 'string' ? s : (s as { name: string }).name
    })
    lines.push('')
    lines.push(
      names
        .map((s) => {
          return `\`${s}\``
        })
        .join(' - '),
    )
  }
  return lines.join('\n')
}

function renderEducation(resume: Resume): string {
  if (!resume.education?.length) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## Education`)
  lines.push('')
  const entries = resume.education.map((edu) => {
    const parts: string[] = []
    parts.push(`### ${edu.name}`)
    if (edu.area) {
      parts.push('')
      parts.push(`**${edu.area}**`)
    }
    if (edu.studyType) {
      parts.push('')
      parts.push(edu.studyType)
    }
    parts.push('')
    parts.push(formatDateRange(edu.startDate, edu.endDate))
    if (edu.courses?.length) {
      parts.push('')
      parts.push(`**Courses:** ${edu.courses.join(', ')}`)
    }
    if (edu.skills?.length) {
      parts.push('')
      parts.push(
        edu.skills
          .map((s) => {
            return `\`${s}\``
          })
          .join(' - '),
      )
    }
    return parts.join('\n').trimEnd()
  })
  lines.push(entries.join('\n\n'))
  return lines.join('\n').trimEnd()
}

function renderSkills(resume: Resume): string {
  if (!resume.skills?.length) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## Skills`)
  lines.push('')
  lines.push(
    resume.skills
      .map((skill) => {
        return `\`${skill.name}\``
      })
      .join(' - '),
  )
  return lines.join('\n').trimEnd()
}

function renderProjects(resume: Resume): string {
  if (!resume.projects?.length) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## Projects`)
  lines.push('')
  const entries = resume.projects.map((proj) => {
    const parts: string[] = []
    parts.push(`### ${proj.name}`)
    if (proj.entity) {
      parts.push('')
      parts.push(`*Associated with ${proj.entity}*`)
    }
    parts.push('')
    parts.push(formatDateRange(proj.startDate, proj.endDate))
    if (proj.description) {
      parts.push('')
      parts.push(proj.description)
    }
    if (proj.highlights?.length) {
      parts.push('')
      for (const h of proj.highlights) {
        parts.push(`- ${h}`)
      }
    }
    if (proj.skills?.length) {
      parts.push('')
      parts.push(
        proj.skills
          .map((s) => {
            return `\`${s}\``
          })
          .join(' - '),
      )
    }
    if (proj.mediaLinks?.length) {
      parts.push('')
      parts.push(
        proj.mediaLinks
          .map((m) => {
            return `[${m.title}](${m.url})`
          })
          .join(' | '),
      )
    }
    return parts.join('\n').trimEnd()
  })
  lines.push(entries.join('\n\n'))
  return lines.join('\n').trimEnd()
}

function renderLanguages(resume: Resume): string {
  if (!resume.languages?.length) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## Languages`)
  lines.push('')
  for (const l of resume.languages) {
    lines.push(`- **${l.language}** - ${l.fluency}`)
  }
  return lines.join('\n').trimEnd()
}

function renderRecommendations(resume: Resume): string {
  const username = userConfigFile.load().username
  const href = `https://www.linkedin.com/in/${username}/details/recommendations/?locale=en_US`

  if (!resume.recommendations?.length) {
    return ''
  }
  const lines: string[] = []
  lines.push(`## Recommendations`)
  lines.push('')
  lines.push(`[View on LinkedIn](${href})`)
  lines.push('')
  const entries = resume.recommendations.map((rec) => {
    const parts: string[] = []
    parts.push(`### [${rec.name}](${href})`)
    if (rec.headline) {
      parts.push('')
      parts.push(`**${rec.headline}**`)
    }
    if (rec.date) {
      parts.push('')
      parts.push(rec.date)
    }
    if (rec.relationship) {
      parts.push('')
      parts.push(`*${rec.relationship}*`)
    }
    return parts.join('\n').trimEnd()
  })
  lines.push(entries.join('\n\n'))
  return lines.join('\n').trimEnd()
}

// --- Utils ---

function formatDate(d: string | undefined): string {
  if (!d) {
    return 'Present'
  }
  const date = new Date(d.length <= 7 ? `${d}-01` : d)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatDateRange(start: string, end: string | undefined): string {
  return `${formatDate(start)} - ${end ? formatDate(end) : 'Present'}`
}
