import type { JSONResponse } from '~~/types'

export default function useAdminMlm() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getAnalytics,
  }

  async function getAnalytics(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/affiliate/analytics`, {
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
}
