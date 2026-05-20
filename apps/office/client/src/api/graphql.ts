export function createGraphqlEndpoint<Var extends Record<string, unknown>, Ret>(query: string) {
  const f = async (variables?: Var) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const responseData = await response.json()
    if (responseData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(responseData.errors)}`)
    }

    return responseData.data as Ret
  }

  return f
}
