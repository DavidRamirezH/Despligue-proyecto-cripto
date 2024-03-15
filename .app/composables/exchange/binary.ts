import type { JSONResponse } from '~~/types'

export default function useOrders() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getBinaryOrders,
    getBinaryOrder,
    createBinaryOrder,
    cancelBinaryOrder,
  }

  async function getBinaryOrders(type: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/exchange/binary/orders`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      query: {
        type,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function getBinaryOrder(uuid: string): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/exchange/binary/orders/${uuid}`,
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

  async function createBinaryOrder(order: any): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/exchange/binary/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        order: order,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function cancelBinaryOrder(
    uuid: string,
    percentage: number,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/exchange/binary/orders/${uuid}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          percentage: percentage,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }
}
