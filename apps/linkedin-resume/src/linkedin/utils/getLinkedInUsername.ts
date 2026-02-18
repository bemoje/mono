import onetime from 'onetime'
import { loadUserConfig } from '../../loadUserConfig'

export const getLinkedInUsername = onetime(async (): Promise<string> => {
  const userConfig = await loadUserConfig()
  return userConfig.linkedInUsername
})
