export default function useAdminStakingLogs() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminStakingLogs = async () => {
    const response = await $fetch(`${apiPath}/api/admin/staking/logs`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminStakingLog = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/logs/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminStakingLogs,
    getAdminStakingLog,
  }
}
