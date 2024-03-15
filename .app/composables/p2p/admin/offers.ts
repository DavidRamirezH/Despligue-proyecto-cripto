export default function useAdminP2POffers() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2POffers = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/offers`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminP2POffer = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/offers/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminP2POffer = async (id, status) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/offers/${id}`, {
      method: 'PUT',
      body: { status },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminP2POffer = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/offers/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminP2POffers,
    getAdminP2POffer,
    updateAdminP2POffer,
    deleteAdminP2POffer,
  }
}
