import type { JSONResponse } from '~~/types'

// Composable to make ecosystem-related tasks easier for admins and users
export default function useEcosystemAdminWallets() {
  const apiPath = useRuntimeConfig().public.apiPath

  return {
    getMasterWallets,
    fetchMasterWalletsBalance,
    getMasterWalletById,
    getMasterWalletByChain,
    createMasterWallet,
    getMasterWalletTransactions,
    getMasterWalletInternalTransactions,
    deployCustodialContract,
    getCustodialWallets,
    getCustodialWallet,
  }

  // Admin Wallet Functions

  async function getMasterWallets(): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets`,
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

  async function fetchMasterWalletsBalance(): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets/update/balance`,
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

  async function getMasterWalletById(uuid: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets/${uuid}`,
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

  async function getMasterWalletByChain(chain: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets/chain/${chain}`,
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

  async function createMasterWallet(chain: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          chain: chain,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getMasterWalletTransactions(
    chain: string,
    address: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets/${chain}/${address}/transactions`,
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

  async function getMasterWalletInternalTransactions(
    chain: string,
    address: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/wallets/${chain}/${address}/transactions/internal`,
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

  async function getCustodialWallets(chain: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/custodial/${chain}`,
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

  async function getCustodialWallet(uuid: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/custodial/wallet/${uuid}`,
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

  async function deployCustodialContract(chain: string): Promise<JSONResponse> {
    const response = await $fetch(
      `${apiPath}/api/admin/ecosystem/blockchains/custodial/deploy?chain=${chain}`,
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
