export default function useUserDisputes() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserDisputes = async () => {
    const response = await $fetch(`${apiPath}/api/p2p/disputes`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserDispute = async (id) => {
    const response = await $fetch(`${apiPath}/api/p2p/disputes/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createUserDispute = async (tradeId, reason) => {
    const response = await $fetch(`${apiPath}/api/p2p/disputes/create`, {
      method: 'POST',
      body: { trade_id: tradeId, reason },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getUserDisputes,
    getUserDispute,
    createUserDispute,
  }
}
