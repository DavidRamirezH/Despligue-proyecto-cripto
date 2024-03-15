export default function useAdminRewards() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAllRewards = async () => {
    const response = await $fetch(`${apiPath}/api/admin/affiliate/rewards`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getRewardById = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/rewards/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateReward = async (id: number, rewardData: object) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/rewards/${id}`,
      {
        method: 'PUT',
        body: rewardData,
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteReward = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/rewards/${id}`,
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
    getAllRewards,
    getRewardById,
    updateReward,
    deleteReward,
  }
}
