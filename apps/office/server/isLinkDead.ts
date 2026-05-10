/**
 * Checks if a link is dead by first sending a HEAD request, and if that fails, sending a GET request. If both requests fail, it considers the link dead.
 */
export async function isLinkDead(url: string): Promise<boolean> {
  try {
    const headResponse = await fetch(url, { method: 'HEAD' })
    if (headResponse.ok) return false

    const getResponse = await fetch(url, { method: 'GET' })
    if (getResponse.ok) return false

    return true
  } catch (_) {
    return true
  }
}
