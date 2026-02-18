import { loadUserConfig } from '../../loadUserConfig'

export const getLinkedInUsername = async (): Promise<string> => {
  const userConfig = await loadUserConfig()
  return userConfig.linkedInUsername
}
