export default function useUserP2PTrades() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserP2PTrades = async () => {
    const response = await $fetch(`${apiPath}/api/p2p/trades`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserP2PTrade = async (uuid) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createUserP2PTrade = async (offer_id, amount) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades`, {
      method: 'POST',
      body: { offer_id, amount },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const sendMessage = async (uuid, message, isSeller) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}/chat`, {
      method: 'POST',
      body: { message, isSeller },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const cancelTrade = async (uuid) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}/cancel`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const markAsPaidTrade = async (uuid, txHash) => {
    const response = await $fetch(
      `${apiPath}/api/p2p/trades/${uuid}/markAsPaid`,
      {
        method: 'POST',
        credentials: 'include',
        body: {
          txHash,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const disputeTrade = async (uuid, reason) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}/dispute`, {
      method: 'POST',
      credentials: 'include',
      body: {
        reason,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const cancelDisputeTrade = async (uuid) => {
    const response = await $fetch(
      `${apiPath}/api/p2p/trades/${uuid}/cancelDispute`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const releaseTrade = async (uuid) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}/release`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const refundTrade = async (uuid) => {
    const response = await $fetch(`${apiPath}/api/p2p/trades/${uuid}/refund`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getUserP2PTrades,
    getUserP2PTrade,
    createUserP2PTrade,
    sendMessage,
    cancelTrade,
    markAsPaidTrade,
    disputeTrade,
    releaseTrade,
    refundTrade,
    cancelDisputeTrade,
  }
}
