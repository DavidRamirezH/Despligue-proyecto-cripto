import type { JSONResponse } from '~~/types'

// Composable to make ecosystem-related tasks easier
export default function useEcosystemWallets() {
  const apiPath = useRuntimeConfig().public.apiPath

  return {
    getWallets,
    getWallet,
    createWallet,
    withdraw,
    transferFunds,
    getDepositAddress,
    unlockDepositAddress,
  }

  async function getWallets(
    transactions: boolean,
    addresses: boolean,
  ): Promise<JSONResponse> {
    const response = await $fetch(`${apiPath}/api/ecosystem/wallets`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      query: {
        transactions: transactions,
        addresses: addresses,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getWallet(currency: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${currency}`,
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

  async function getDepositAddress(chain: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${chain}/address`,
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

  async function createWallet(currency: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${currency}`,
      {
        method: 'POST',
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

  async function withdraw(
    uuid: string,
    chain: string,
    amount: string,
    toAddress: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${uuid}/withdraw`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          chain: chain,
          amount: amount,
          toAddress: toAddress,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function transferFunds(
    uuid: string,
    currency: string,
    amount: number,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${uuid}/transfer`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          currency: currency,
          amount: amount,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function unlockDepositAddress(address: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/ecosystem/wallets/${address}/unlock-deposit-address`,
      {
        method: 'get',
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
