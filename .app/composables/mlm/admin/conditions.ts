export default function useAdminReferralConditions() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getReferralConditions = async () => {
    const response = await $fetch(`${apiPath}/api/admin/affiliate/conditions`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getReferralConditionById = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/conditions/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateReferralConditionStatus = async (id, status) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/conditions/${id}/status`,
      {
        method: 'PUT',
        body: {
          status,
        },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateReferralCondition = async (
    id: number,
    title: string,
    description: string,
    reward: number,
    reward_type: 'FIXED' | 'PERCENTAGE',
    reward_currency: string,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/conditions/${id}`,
      {
        method: 'PUT',
        body: {
          title,
          description,
          reward,
          reward_type,
          reward_currency,
        },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteReferralCondition = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/conditions/${id}`,
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
    getReferralConditions,
    getReferralConditionById,
    updateReferralCondition,
    deleteReferralCondition,
    updateReferralConditionStatus,
  }
}
