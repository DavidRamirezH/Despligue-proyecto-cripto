import type { JSONResponse } from '~~/types'

export default function useWallets() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    updateTransactionStatus,
    approveSpotWalletWithdrawal,
    rejectSpotWalletWithdrawal,
  }

  async function updateTransactionStatus(
    referenceId: number,
    status: string,
    message?: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/wallets/transactions/update-status`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          referenceId: referenceId,
          status: status,
          message: message,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }

  async function approveSpotWalletWithdrawal(
    uuid: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/wallets/withdrawal/approve/${uuid}`,
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

  async function rejectSpotWalletWithdrawal(
    uuid: string,
    message: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/wallets/withdrawal/reject/${uuid}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          message: message,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }
}
