export default function useAdminP2PDisputes() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2PDisputes = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/disputes`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminP2PDispute = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/disputes/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const resolveAdminP2PDispute = async (id, resolution) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/disputes/${id}`, {
      method: 'PUT',
      body: { resolution },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const markAdminP2PDisputeAsResolved = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/disputes/${id}/markAsResolved`,
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
    getAdminP2PDisputes,
    getAdminP2PDispute,
    resolveAdminP2PDispute,
    markAdminP2PDisputeAsResolved,
  }
}
