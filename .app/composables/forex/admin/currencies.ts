import type { JSONResponse } from '~~/types'

export default function useAdminForexCurrency() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getForexCurrencies,
    getForexCurrency,
    createForexCurrency,
    updateForexCurrency,
    deleteForexCurrency,
  }

  async function getForexCurrencies(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/currencies`, {
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

  async function getForexCurrency(id: number): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/forex/currencies/${id}`,
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

  async function createForexCurrency(currency: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/currencies`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        currency: currency,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateForexCurrency(
    id: number,
    currency: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/forex/currencies/${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          currency: currency,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }

  async function deleteForexCurrency(id: number): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/forex/currencies/${id}`,
      {
        method: 'DELETE',
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
