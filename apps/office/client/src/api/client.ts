import type { AppType } from '../../../server/index'
import { hc } from 'hono/client'

export const apiClient = hc<AppType>('http://localhost:3001/', {
  //   headers: () => {
  //     // Grab the token from localStorage
  //     const token = localStorage.getItem('jwt_token')
  //     if (token) {
  //       return {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     }
  //     return {}
  //   },
}).api
