import type { JSONResponse } from '~~/types'

// Composable to make ecosystem-related tasks easier for admins and users
export default function useEcosystemAdminTokens() {
  const apiPath = useRuntimeConfig().public.apiPath

  return {
    getAdminTokens,
    getAdminTokensAll,
    fetchTokenBalances,
    getAdminTokenById,
    createAdminToken,
    importAdminToken,
    updateAdminToken,
    getTokenHolders,
    updateAdminTokenIcon,
    updateTokenStatusBulk,
  }

  // Admin Token Functions

  async function getAdminTokens(params = {}): Promise<JSONResponse> {
    const response = await $fetch(`${apiPath}/api/admin/ecosystem/tokens`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      params,
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getAdminTokensAll(params = {}): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/fetch/all`,
      {
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        params,
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function fetchTokenBalances(): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/update/balance`,
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

  async function getAdminTokenById(currency: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/${currency}`,
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

  async function createAdminToken(
    chain: string,
    name: string,
    currency: string,
    initialSupply: number,
    cap: number,
    initialHolder: string,
    decimals: number,
  ): Promise<JSONResponse> {
    const response = await $fetch(`${apiPath}/api/admin/ecosystem/tokens`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        chain: chain,
        name: name,
        currency: currency,
        initialSupply: initialSupply,
        cap: cap,
        initialHolder: initialHolder,
        decimals: decimals,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function importAdminToken(
    name: string,
    currency: string,
    chain: string,
    network: string,
    type: string,
    contract: string,
    decimals: number,
    contractType: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/import`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          name,
          currency,
          chain,
          network,
          type,
          contract,
          decimals,
          contractType,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateAdminToken(
    id: number,
    precision: number,
    limits: any,
    fees: any,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/${id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          precision: precision,
          limits: limits,
          fees: fees,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateAdminTokenIcon(
    id: number,
    icon: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/${id}/icon`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          icon: icon,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getTokenHolders(
    chain: string,
    address: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/tokens/${chain}/${address}/holders`,
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

  async function updateTokenStatusBulk(
    ids: number[],
    status: boolean,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/ecosystem/tokens/update-status`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          ids: ids,
          status: status,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }
}
