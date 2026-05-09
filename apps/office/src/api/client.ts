import type { AppType } from '../../server/index'
import { hc } from 'hono/client'

export const apiClient = hc<AppType>('/')
