import type { AppType } from '../../../server/index'
import { hc } from 'hono/client'

export const apiClient = hc<AppType>('/', {
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
})

// import type { InferRequestType } from 'hono/client'
// import type { InferResponseType } from 'hono/client'

// type ResType = InferResponseType<typeof apiClient.api.articles.$get>
// type ReqType = InferResponseType<typeof apiClient.api.analytics.track.$post,200>

// const res=await apiClient.api.analytics.track.$post({
//   json: {
//     event: 'click',
//     articleId: 123,
//   },
// })

// if(res.ok) {

//   const data=(await res.json())
//   data
// }
