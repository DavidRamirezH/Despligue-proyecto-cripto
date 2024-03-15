import type { JSONResponse } from '~~/types'

export default function useIcoAllocation() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getIcoAllocations,
    getIcoAllocation,
  }

  async function getIcoAllocations(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/ico/allocations`, {
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

  async function getIcoAllocation(id: number): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/ico/allocations/${id}`, {
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
