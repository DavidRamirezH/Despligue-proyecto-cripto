import type { JSONResponse } from '~~/types'

// Composable to make ecosystem-related tasks easier
export default function useEcosystemTokens() {
  const apiPath = useRuntimeConfig().public.apiPath

  return {
    getTokens,
    getToken,
  }

  async function getTokens(): Promise<JSONResponse> {
    const response = await $fetch(`${apiPath}/api/ecosystem/tokens`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getToken(currency: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/tokens/${currency}`,
      {
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }
}
