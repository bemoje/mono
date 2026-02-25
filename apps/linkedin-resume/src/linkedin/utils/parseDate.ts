export function parseDate(d: string | undefined): string {
  if (!d) {
    return ''
  }
  if (d === 'Present') {
    return 'Present'
  }
  try {
    return new Date(Date.parse(`2 ${d}`)).toISOString().slice(0, 7)
  } catch {
    return d
  }
}
