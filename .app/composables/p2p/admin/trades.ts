export default function useAdminP2PTrades() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2PTrades = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/trades`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminP2PTrade = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/trades/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminP2PTrade = async (id, status) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/trades/${id}`, {
      method: 'PUT',
      body: { status },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const cancelAdminP2PTrade = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/trades/${id}/cancel`,
      {
        method: 'PUT',
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const completeAdminP2PTrade = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/trades/${id}/complete`,
      {
        method: 'PUT',
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminP2PTrades,
    getAdminP2PTrade,
    updateAdminP2PTrade,
    cancelAdminP2PTrade,
    completeAdminP2PTrade,
  }
}
