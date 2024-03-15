export default function useUserStakingPools() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getStakingPools = async () => {
    const response = await $fetch(`${apiPath}/api/staking/pools`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getStakingPool = async (id) => {
    const response = await $fetch(`${apiPath}/api/staking/pools/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getStakingPools,
    getStakingPool,
  }
}
