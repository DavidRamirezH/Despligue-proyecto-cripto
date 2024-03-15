export default function useUserP2pActions() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2pAnalytics = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/analytics`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminP2pAnalytics,
  }
}
