import fs from 'fs-extra'
import { DIST_PATH } from './constants'
import upath from 'upath'
import css from './renderResumeHtml.css'
import type { Resume, ResumeWork } from './types/Resume'
import { loadUserConfig } from './loadUserConfig'
import { entriesOf } from '@mono/object'

export async function renderResumeHtml(): Promise<void> {
  const resume = await loadResume()

  const lines: string[] = []
  lines.push(`<!DOCTYPE html>`)
  lines.push(`<html lang="en">`)
  lines.push(`<head>`)
  lines.push(`<meta charset="utf-8" />`)
  lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1" />`)
  lines.push(`<title>CV - ${esc(resume.basics.name)}</title>`)
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
    .replace(/[>] *[<]/g, '>\n<')
    .split('\n')
    .map((line) => line.trimStart())
    .filter(Boolean)
    .join('\n')

  const outPath = upath.join(DIST_PATH, 'resume.html')
  await fs.outputFile(outPath, html)
  console.log(`output: ${outPath}`)

  const cssPath = upath.join(DIST_PATH, 'resume.css')
  await fs.outputFile(cssPath, css)
  console.log(`output: ${cssPath}`)
}

function renderProfile(resume: Resume): string {
  const b = resume.basics
  const loc = b.location
  const locationStr = [loc.city, loc.region, loc.countryCode].filter(Boolean).join(', ')
  return `
  <div class="profile-card card">
    <div class="profile-banner"></div>
    <div class="profile-body">
      <img class="profile-photo" src="${esc(b.image)}" alt="${esc(b.name)}" />
      <div class="profile-info">
        <h1>${esc(b.name)}</h1>
        <p class="profile-headline">${esc(b.label)}</p>
        <p class="profile-location">${esc(locationStr)}</p>
        <div class="profile-contact">
          ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
          ${b.phone ? `<a href="tel:${esc(b.phone)}">${esc(b.phone)}</a>` : ''}
        </div>
        <div class="profile-links">
          ${(b.profiles ?? []).map((p) => `<a href="${esc(p.url)}" class="profile-link">${esc(p.network)}</a>`).join(' ')}
        </div>
      </div>
    </div>
  </div>`
}

function renderAbout(resume: Resume): string {
  if (!resume.basics.summary) return ''
  const lines = ['']
  lines.push(`<div class="card">`)
  lines.push(`<h2>About</h2>`)
  lines.push(`<div class="about-text">`)
  lines.push(`${nl2p(resume.basics.summary)}`)
  lines.push(`</div>`)
  if (resume.basics.skills?.length) {
    lines.push(`<div class="entry">`)
    lines.push(`<div class="entry-content">`)
    lines.push(`<div class="skill-pills">`)
    resume.basics.skills.forEach((s) => {
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
  if (!resume.work?.length) return ''

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
      ${groups.map((g) => renderExperienceGroup(g)).join('\n')}
    </div>
  </div>`
}

function renderExperienceGroup(group: ExperienceGroup): string {
  if (group.roles.length === 1) {
    const job = group.roles[0]
    return `
      <div class="entry">
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
          ${group.roles.map((job) => renderSubRole(job)).join('\n')}
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
        </div>`
}

function renderJobBody(job: ResumeWork): string {
  let html = ''
  if (job.summary) {
    html += `<p class="entry-description">${esc(job.summary)}</p>`
  }
  if (job.highlights?.length) {
    html += `<ul class="entry-highlights">${job.highlights.map((h) => `<li>${esc(h)}</li>`).join('\n')}</ul>`
  }
  if (job.skills?.length) {
    const names = job.skills.map((s) => (typeof s === 'string' ? s : (s as { name: string }).name))
    html += `<div class="skill-pills">${names.map((s) => `<span class="pill">${esc(s)}</span>`).join('\n')}</div>`
  }
  return html
}

function renderEducation(resume: Resume): string {
  if (!resume.education?.length) return ''
  return `
  <div class="card">
    <h2>Education</h2>
    <div class="entries">
      ${resume.education
        .map(
          (edu) => `
        <div class="entry">
          <div class="entry-logo">${entryLogo(edu, 'institution')}</div>
          <div class="entry-content">
            <h3 class="entry-title">${esc(edu.institution)}</h3>
            ${edu.area ? `<p class="entry-subtitle">${esc(edu.area)}</p>` : ''}
            ${edu.studyType ? `<p class="entry-meta">${esc(edu.studyType)}</p>` : ''}
            <p class="entry-meta">${formatDateRange(edu.startDate, edu.endDate)}</p>
            ${edu.courses?.length ? `<p class="entry-description"><strong>Courses:</strong> ${edu.courses.map(esc).join(', ')}</p>` : ''}
            ${edu.skills?.length ? `<div class="skill-pills">${edu.skills.map((s) => `<span class="pill">${esc(s)}</span>`).join('\n')}</div>` : ''}
          </div>
        </div>`,
        )
        .join('\n')}
    </div>
  </div>`
}

function renderSkills(resume: Resume): string {
  if (!resume.skills?.length) return ''
  return `
  <div class="card">
    <h2>Skills</h2>
    <div class="skills-sections">
      <div class="skill-category">
        <div class="skill-pills">
          ${resume.skills.map((skill) => `<span class="pill">${esc(skill.name)}</span>`).join('\n')}
        </div>
      </div>
    </div>
  </div>`
}

function renderProjects(resume: Resume): string {
  if (!resume.projects?.length) return ''
  return `
  <div class="card">
    <h2>Projects</h2>
    <div class="entries">
      ${resume.projects
        .map(
          (proj) => `
        <div class="entry">
          <div class="entry-logo">${entryLogo(proj)}</div>
          <div class="entry-content">
            <h3 class="entry-title">${esc(proj.name)}</h3>
            ${proj.entity ? `<p class="entry-subtitle">Associated with ${esc(proj.entity)}</p>` : ''}
            <p class="entry-meta">${formatDateRange(proj.startDate, proj.endDate)}</p>
            ${proj.description ? `<p class="entry-description">${esc(proj.description)}</p>` : ''}
            ${proj.highlights?.length ? `<ul class="entry-highlights">${proj.highlights.map((h) => `<li>${esc(h)}</li>`).join('\n')}</ul>` : ''}
            ${proj.skills?.length ? `<div class="skill-pills">${proj.skills.map((s) => `<span class="pill">${esc(s)}</span>`).join('\n')}</div>` : ''}
            ${proj.mediaLinks?.length ? `<div class="media-links">${proj.mediaLinks.map((m) => `<a href="${esc(m.url)}" class="media-link" target="_blank" rel="noopener">${esc(m.title)} ↗</a>`).join('\n')}</div>` : ''}
          </div>
        </div>`,
        )
        .join('\n')}
    </div>
  </div>`
}

function renderLanguages(resume: Resume): string {
  if (!resume.languages?.length) return ''
  return `
  <div class="card">
    <h2>Languages</h2>
    <div class="languages-list">
      ${resume.languages.map((l) => `<div class="language-item"><span class="language-name">${esc(l.language)}</span><span class="language-fluency">${esc(l.fluency)}</span></div>`).join('\n')}
    </div>
  </div>`
}

function renderRecommendations(resume: Resume): string {
  const username = resume.basics.profiles.find((p) => p.network === 'LinkedIn')!.username
  const href = `https://www.linkedin.com/in/${username}/details/recommendations`

  if (!resume.recommendations?.length) return ''
  return `
  <div class="card">
    <h2 class="recommendations-heading">Recommendations <a href="${esc(href)}" class="recommendations-link">View on LinkedIn ↗</a></h2>
    <div class="entries">
      ${resume.recommendations
        .map(
          (rec) => `
        <div class="entry">
          <div class="entry-logo">${rec.logoUrl ? `<img class="entry-logo-img recommendation-photo" src="${esc(rec.logoUrl)}" alt="${esc(rec.name)}" />` : companyInitial(rec.name)}</div>
          <div class="entry-content">
            <h3 class="entry-title"><a href="${esc(href)}">${esc(rec.name)}</a></h3>
            ${rec.headline ? `<p class="entry-subtitle">${esc(rec.headline)}</p>` : ''}
            ${rec.date ? `<p class="entry-meta">${esc(rec.date)}</p>` : ''}
            ${rec.relationship ? `<p class="entry-meta recommendation-relationship">${esc(rec.relationship)}</p>` : ''}
          </div>
        </div>`,
        )
        .join('\n')}
    </div>
  </div>`
}

// --- Utils ---

async function loadResume() {
  const resume = (await fs.readJson(upath.join(DIST_PATH, 'resume.json'))) as Resume

  const userConfig = await loadUserConfig()

  if (userConfig.ignore) {
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

function esc(s: string): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function formatDate(d: string | undefined): string {
  if (!d) return 'Present'
  const date = new Date(d.length <= 7 ? d + '-01' : d)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatDateRange(start: string, end: string | undefined): string {
  return `${formatDate(start)} - ${end ? formatDate(end) : 'Present'}`
}

function nl2p(text: string): string {
  return text
    .split(/\n+/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('\n')
}

function companyInitial(name: string): string {
  const letter = (name ?? '?')[0].toUpperCase()
  return `<div class="logo-placeholder">${letter}</div>`
}

function entryLogo(
  item: { logoUrl?: string; name?: string; institution?: string },
  nameField: 'name' | 'institution' = 'name',
): string {
  const label = (nameField === 'institution' ? (item as { institution?: string }).institution : item.name) ?? ''
  if (item.logoUrl) {
    return `<img class="entry-logo-img" src="${esc(item.logoUrl)}" alt="${esc(label)}" />`
  }
  return companyInitial(label)
}
