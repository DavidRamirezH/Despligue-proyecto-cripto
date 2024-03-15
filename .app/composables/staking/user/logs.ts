export default function useUserStakingLogs() {
  const apiPath = useRuntimeConfig().public.apiPath

  // Depending on how you want to handle -specific logs, you might need to pass  identification, like Id.
  const getStakingLogs = async () => {
    const response = await $fetch(`${apiPath}/api/staking`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getStakingLog = async (id) => {
    const response = await $fetch(`${apiPath}/api/staking/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getStakingLogs,
    getStakingLog,
  }
}
