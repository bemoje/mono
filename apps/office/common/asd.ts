import type { ArticleUpdate } from './schema'

export async function updateArticleDebaitedContent1(
  variables: Pick<ArticleUpdate, 'id' | 'debaitedHeading' | 'debaitedSummary'>
) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      mutation ($id: Int!, $debaitedHeading: String, $debaitedSummary: String) {
        updateArticles(
          where: {id: {eq: $id}}
          set: {debaitedHeading: $debaitedHeading, debaitedSummary: $debaitedSummary}
        ) {
          id
        }
      }`,
      variables,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const responseData = await response.json()
  if (responseData.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(responseData.errors)}`)
  }

  return responseData.data
}
