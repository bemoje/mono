import { DIST_PATH } from './constants'
import type { Logger } from '@mono/node'
import type { Resume } from './types/Resume'
import type { ResumeWork } from './types/Resume'
import css from './renderResumeHtml.css'
import fs from 'fs-extra'
import { loadResumeJson } from './LoadResumeJson'
import upath from 'upath'
import { userConfigFile } from './userConfigFile'

export async function renderResumeHtml(logger: Logger): Promise<void> {
  const resume = await loadResumeJson()

  const lines: string[] = []
  lines.push(`<!DOCTYPE html>`)
  lines.push(`<html lang="en">`)
  lines.push(`<head>`)
  lines.push(`<meta charset="utf-8" />`)
  lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1" />`)
  lines.push(`<title>Resume - ${esc(resume.basics.name)}</title>`)
  lines.push(`<link rel="stylesheet" href="resume.css" />`)
  lines.push(`</head>`)
  lines.push(`<body>`)
  lines.push(`<div class="container">`)
  lines.push(`${renderProfile(resume)}`)
  lines.push(`${renderAbout(resume)}`)
  lines.push(`${renderExperience(resume)}`)
  lines.push(`${renderEducation(resume)}`)
  lines.push(`${renderProjects(resume)}`)
  lines.push(`${renderLanguages(resume)}`)
  lines.push(`${renderRecommendations(resume)}`)
  lines.push(`${renderSkills(resume)}`)
  lines.push(`</div>`)
  lines.push(`</body>`)
  lines.push(`</html>`)

  const html = lines
    .join('\n')
    .replaceAll(/> *</g, '>\n<')
    .split('\n')
    .map((line) => {
      return line.trimStart()
    })
    .filter(Boolean)
    .join('\n')

  const outPath = upath.join(DIST_PATH, 'resume.html')
  await fs.outputFile(outPath, html)
  logger.log(outPath)

  const cssPath = upath.join(DIST_PATH, 'resume.css')
  await fs.outputFile(cssPath, css)
  logger.log(cssPath)
}

function renderProfile(resume: Resume): string {
  const b = resume.basics
  const loc = b.location
  const locationStr = [loc?.city, loc?.region, loc?.countryCode].filter(Boolean).join(', ')
  return `
  <div class="profile-card card">
    <div class="profile-banner"></div>
    <div class="profile-body">
      <img class="profile-photo" src="${esc(b.image)}" alt="${esc(b.name)}" />
      <div class="profile-info">
        <h1>${esc(b.name)}</h1>
        <p class="profile-headline">${esc(b.headline)}</p>
        <p class="profile-location">${esc(locationStr)}</p>
        <div class="profile-contact">
          ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
          ${b.phone ? `<a href="tel:${esc(b.phone)}">${esc(b.phone)}</a>` : ''}
        </div>
        <div class="profile-links">
          ${(b.social ?? [])
            .map((p) => {
              return `<a href="${esc(p.url)}" class="profile-link">${esc(p.network)}</a>`
            })
            .join(' ')}
        </div>
      </div>
    </div>
  </div>`
}

function renderAbout(resume: Resume): string {
  if (!resume.basics.summary) {
    return ''
  }
  const lines = ['']
  lines.push(`<div class="card">`)
  lines.push(`<h2>About</h2>`)
  lines.push(`<div class="about-text">`)
  lines.push(`${nl2p(resume.basics.summary)}`)
  lines.push(`</div>`)
  if (resume.basics.topSkills?.length) {
    lines.push(`<div class="entry">`)
    lines.push(`<div class="entry-content">`)
    lines.push(`<div class="skill-pills">`)
    resume.basics.topSkills.forEach((s) => {
      lines.push(`<span class="pill">${esc(s)}</span>`)
    })
    lines.push(`</div>`)
    lines.push(`</div>`)
    lines.push(`</div>`)
  }
  lines.push(`</div>`)
  return lines.join('\n')
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

  return `
  <div class="card">
    <h2>Experience</h2>
    <div class="entries">
      ${groups
        .map((g) => {
          return renderExperienceGroup(g)
        })
        .join('\n')}
    </div>
  </div>`
}

function renderExperienceGroup(group: ExperienceGroup): string {
  if (group.roles.length === 1) {
    const job = group.roles[0]
    return `
      <div class="entry entry-single">
        <div class="entry-logo">${entryLogo(job)}</div>
        <div class="entry-content">
          <h3 class="entry-title">${esc(job.position)}</h3>
          <p class="entry-subtitle">${esc(job.name)}${job.location ? ` · <span class="entry-meta">${esc(job.location)}</span>` : ''}</p>
          <p class="entry-meta">${formatDateRange(job.startDate, job.endDate)}${job.duration ? ` · ${esc(job.duration)}` : ''}</p>
          ${renderJobBody(job)}
        </div>
      </div>`
  }

  // Grouped multi-role
  const first = group.roles[0]
  const last = group.roles[group.roles.length - 1]
  return `
    <div class="entry entry-grouped">
      <div class="entry-logo">${entryLogo(first)}</div>
      <div class="entry-content">
        <h3 class="entry-title">${esc(group.company)}</h3>
        <p class="entry-meta">${formatDateRange(last.startDate, first.endDate)}</p>
        <div class="sub-roles">
          ${group.roles
            .map((job) => {
              return renderSubRole(job)
            })
            .join('\n')}
        </div>
      </div>
    </div>`
}

function renderSubRole(job: ResumeWork): string {
  return `
    <div class="sub-role">
      <div class="sub-role-dot"></div>
      <div class="sub-role-content">
        <h4 class="entry-title">${esc(job.position)}</h4>
        <p class="entry-meta">${formatDateRange(job.startDate, job.endDate)}${job.duration ? ` · ${esc(job.duration)}` : ''}</p>
        ${job.location ? `<p class="entry-meta">${esc(job.location)}</p>` : ''}
        ${renderJobBody(job)}
      </div>
    </div>
  `
}

function renderJobBody(job: ResumeWork): string {
  let html = ''
  if (job.summary) {
    html += `<p class="entry-description">${esc(job.summary)}</p>`
  }
  if (job.highlights?.length) {
    html += `<ul class="entry-highlights">${job.highlights
      .map((h) => {
        return `<li>${esc(h)}</li>`
      })
      .join('\n')}</ul>`
  }
  if (job.skills?.length) {
    const names = job.skills.map((s) => {
      return typeof s === 'string' ? s : (s as { name: string }).name
    })
    html += `<div class="skill-pills">${names
      .map((s) => {
        return `<span class="pill">${esc(s)}</span>`
      })
      .join('\n')}</div>`
  }
  return html
}

function renderEducation(resume: Resume): string {
  if (!resume.education?.length) {
    return ''
  }
  return `
  <div class="card">
    <h2>Education</h2>
    <div class="entries">
      ${resume.education
        .map((edu) => {
          return `
        <div class="entry">
          <div class="entry-logo">${entryLogo(edu)}</div>
          <div class="entry-content">
            <h3 class="entry-title">${esc(edu.name)}</h3>
            ${edu.area ? `<p class="entry-subtitle">${esc(edu.area)}</p>` : ''}
            ${edu.studyType ? `<p class="entry-meta">${esc(edu.studyType)}</p>` : ''}
            <p class="entry-meta">${formatDateRange(edu.startDate, edu.endDate)}</p>
            ${edu.courses?.length ? `<p class="entry-description"><strong>Courses:</strong> ${edu.courses.map(esc).join(', ')}</p>` : ''}
            ${
              edu.skills?.length
                ? `<div class="skill-pills">${edu.skills
                    .map((s) => {
                      return `<span class="pill">${esc(s)}</span>`
                    })
                    .join('\n')}</div>`
                : ''
            }
          </div>
        </div>`
        })
        .join('\n')}
    </div>
  </div>`
}

function renderSkills(resume: Resume): string {
  if (!resume.skills?.length) {
    return ''
  }
  return `
  <div class="card">
    <h2>Skills</h2>
    <div class="skills-sections">
      <div class="skill-category">
        <div class="skill-pills">
          ${resume.skills
            .map((skill) => {
              return `<span class="pill">${esc(skill.name)}</span>`
            })
            .join('\n')}
        </div>
      </div>
    </div>
  </div>`
}

function renderProjects(resume: Resume): string {
  if (!resume.projects?.length) {
    return ''
  }
  return `
  <div class="card">
    <h2>Projects</h2>
    <div class="entries">
      ${resume.projects
        .map((proj) => {
          return `
        <div class="entry">
          <div class="entry-logo">${entryLogo(proj)}</div>
          <div class="entry-content">
            <h3 class="entry-title">${esc(proj.name)}</h3>
            ${proj.entity ? `<p class="entry-subtitle">Associated with ${esc(proj.entity)}</p>` : ''}
            <p class="entry-meta">${formatDateRange(proj.startDate, proj.endDate)}</p>
            ${proj.description ? `<p class="entry-description">${esc(proj.description)}</p>` : ''}
            ${
              proj.highlights?.length
                ? `<ul class="entry-highlights">${proj.highlights
                    .map((h) => {
                      return `<li>${esc(h)}</li>`
                    })
                    .join('\n')}</ul>`
                : ''
            }
            ${
              proj.skills?.length
                ? `<div class="skill-pills">${proj.skills
                    .map((s) => {
                      return `<span class="pill">${esc(s)}</span>`
                    })
                    .join('\n')}</div>`
                : ''
            }
            ${
              proj.mediaLinks?.length
                ? `<div class="media-links">${proj.mediaLinks
                    .map((m) => {
                      return `<a href="${esc(m.url)}" class="media-link" target="_blank" rel="noopener">${esc(m.title)} ↗</a>`
                    })
                    .join('\n')}</div>`
                : ''
            }
          </div>
        </div>`
        })
        .join('\n')}
    </div>
  </div>`
}

function renderLanguages(resume: Resume): string {
  if (!resume.languages?.length) {
    return ''
  }
  return `
  <div class="card">
    <h2>Languages</h2>
    <div class="languages-list">
      ${resume.languages
        .map((l) => {
          return `<div class="language-item"><span class="language-name">${esc(l.language)}</span><span class="language-fluency">${esc(l.fluency)}</span></div>`
        })
        .join('\n')}
    </div>
  </div>`
}

function renderRecommendations(resume: Resume): string {
  const username = userConfigFile.load().username
  const href = `https://www.linkedin.com/in/${username}/details/recommendations/?locale=en_US`

  if (!resume.recommendations?.length) {
    return ''
  }
  return `
  <div class="card">
    <h2 class="recommendations-heading">Recommendations <a href="${esc(href)}" class="recommendations-link">View on LinkedIn ↗</a></h2>
    <div class="entries">
      ${resume.recommendations
        .map((rec) => {
          return `
        <div class="entry">
          <div class="entry-logo">${rec.logoUrl ? `<img class="entry-logo-img recommendation-photo" src="${esc(rec.logoUrl)}" alt="${esc(rec.name)}" />` : companyInitial(rec.name)}</div>
          <div class="entry-content">
            <h3 class="entry-title"><a href="${esc(href)}">${esc(rec.name)}</a></h3>
            ${rec.headline ? `<p class="entry-subtitle">${esc(rec.headline)}</p>` : ''}
            ${rec.date ? `<p class="entry-meta">${esc(rec.date)}</p>` : ''}
            ${rec.relationship ? `<p class="entry-meta recommendation-relationship">${esc(rec.relationship)}</p>` : ''}
          </div>
        </div>`
        })
        .join('\n')}
    </div>
  </div>`
}

// --- Utils ---

function esc(s: string): string {
  return (s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

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

function nl2p(text: string): string {
  return text
    .split(/\n+/)
    .map((p) => {
      return `<p>${esc(p)}</p>`
    })
    .join('\n')
}

function companyInitial(name: string): string {
  const letter = (name ?? '?')[0].toUpperCase()
  return `<div class="logo-placeholder">${letter}</div>`
}

function entryLogo(item: { logoUrl?: string; name: string }): string {
  if (item.logoUrl) {
    return `<img class="entry-logo-img" src="${esc(item.logoUrl)}" alt="${esc(item.name)}" />`
  }
  return companyInitial(item.name)
}
