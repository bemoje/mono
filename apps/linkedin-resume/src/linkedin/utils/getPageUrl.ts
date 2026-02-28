import type { ResumeSection } from '../../types/ResumeSection'

/**
 * Get the URL for a LinkedIn page for a given section.
 * @param username The LinkedIn username (the part after linkedin.com/in/)
 * @param section The resume section to get the details page URL for
 * @returns The full URL to the LinkedIn details page for the specified section
 */
export function getPageUrl(username: string, section: ResumeSection): string {
  const url = new URL(`https://www.linkedin.com/in/${username}/`)

  // ! ensure locale is set to en_US to get consistent structure and English text needed for correct scraping
  url.searchParams.set('locale', 'en_US')

  if (section === 'profile') {
    return url.href
  }

  url.pathname += `details/${section}/`

  return url.href
}
