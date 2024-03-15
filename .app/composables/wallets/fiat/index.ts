import type { JSONResponse, Transaction } from '~~/types'

export default function useWallets() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getDepositGateways,
    getDepositGateway,
    getDepositMethods,
    getDepositMethod,
    depositFiat,
    getFiatTransactions,
    withdrawFiat,
    customFiatDepositMethod,
    getWithdrawMethods,
    getWithdrawMethod,
    stripeDeposit,
    stripeVerify,
  }

  async function stripeDeposit(
    amount: number,
    currency: string,
    taxAmount: number,
    flutter: boolean,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/ipn/stripe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        amount,
        currency,
        taxAmount,
        flutter,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function stripeVerify(sessionId: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/ipn/stripe/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        sessionId,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function getDepositGateways(): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/deposit/gateways`,
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

  async function getDepositGateway(id: number): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/deposit/gateways/${id}`,
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

  async function getDepositMethods(): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/deposit/methods`,
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

  async function getDepositMethod(id: number): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/deposit/methods/${id}`,
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

  async function getWithdrawMethods(): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/withdraw/methods`,
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

  async function getWithdrawMethod(id: number): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/withdraw/methods/${id}`,
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

  async function depositFiat(
    transaction: Transaction,
    currency: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/wallets/fiat/deposit`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        transaction: transaction,
        currency: currency,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getFiatTransactions(wallet: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/wallets/fiat/transactions`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      query: {
        uuid: wallet,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function withdrawFiat(
    wallet: string,
    withdrawMethodId: number,
    amount: number,
    total: number,
    customData: Array<{ [key: string]: string }>,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/wallets/fiat/withdraw`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        wallet: wallet,
        methodId: withdrawMethodId,
        amount: amount,
        total: total,
        custom_data: customData,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function customFiatDepositMethod(
    wallet: string,
    withdrawMethodId: number,
    amount: number,
    total: number,
    customData: Array<{ [key: string]: string }>,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/wallets/fiat/deposit/method`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          wallet: wallet,
          methodId: withdrawMethodId,
          amount: amount,
          total: total,
          custom_data: customData,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }
}
