import { createInterface } from 'node:readline/promises'
import { UserConfig } from './types/UserConfig'
import { userConfigFile } from './userConfigFile'

export async function loadUserConfig(): Promise<UserConfig> {
  const config = userConfigFile.load()

  if (config.linkedInUsername) {
    return config
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const username = (await rl.question('Enter your LinkedIn username: ')).trim()
  rl.close()

  if (!username) {
    console.error('LinkedIn username is required.')
    process.exit(1)
  }

  return userConfigFile.update((config) => ({ ...config, linkedInUsername: username }))
}
