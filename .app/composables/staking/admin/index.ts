export default function useUserStakingActions() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminStakingAnalytics = async () => {
    const response = await $fetch(`${apiPath}/api/admin/staking/analytics`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminStakingAnalytics,
  }
}
