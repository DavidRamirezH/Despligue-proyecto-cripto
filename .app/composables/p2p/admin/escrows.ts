export default function useAdminP2PEscrows() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2PEscrows = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/escrow`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminP2PEscrow = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/escrow/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminP2PEscrows,
    getAdminP2PEscrow,
  }
}
