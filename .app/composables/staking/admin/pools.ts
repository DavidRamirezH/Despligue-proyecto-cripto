export default function useAdminStakingPools() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminStakingPools = async () => {
    const response = await $fetch(`${apiPath}/api/admin/staking/pools`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminStakingPool = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/pools/${id}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminStakingPool = async (
    name: string,
    description: string | null,
    currency: string,
    chain: string,
    type: string,
    min_stake: number,
    max_stake: number,
    status: string,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/pools`, {
      method: 'POST',
      body: {
        name,
        description,
        currency,
        chain,
        type,
        min_stake,
        max_stake,
        status,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminStakingPool = async (
    id: number,
    name: string,
    description: string | null,
    currency: string,
    chain: string,
    type: string,
    min_stake: number,
    max_stake: number,
    status: string,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/pools/${id}`, {
      method: 'PUT',
      body: {
        name,
        description,
        currency,
        chain,
        type,
        min_stake,
        max_stake,
        status,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminStakingPool = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/pools/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminStakingPools,
    getAdminStakingPool,
    createAdminStakingPool,
    updateAdminStakingPool,
    deleteAdminStakingPool,
  }
}
