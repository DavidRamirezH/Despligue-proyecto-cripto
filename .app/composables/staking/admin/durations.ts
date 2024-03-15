export default function useAdminStakingDurations() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminStakingDurations = async () => {
    const response = await $fetch(`${apiPath}/api/admin/staking/durations`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminStakingDuration = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/staking/durations/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminStakingDuration = async (
    pool_id: number,
    duration: number,
    interest_rate: number,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/staking/durations`, {
      method: 'POST',
      body: {
        pool_id,
        duration,
        interest_rate,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminStakingDuration = async (
    id: number,
    pool_id: number,
    duration: number,
    interest_rate: number,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/staking/durations/${id}`,
      {
        method: 'PUT',
        body: {
          pool_id,
          duration,
          interest_rate,
        },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminStakingDuration = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/staking/durations/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminStakingDurations,
    getAdminStakingDuration,
    createAdminStakingDuration,
    updateAdminStakingDuration,
    deleteAdminStakingDuration,
  }
}
