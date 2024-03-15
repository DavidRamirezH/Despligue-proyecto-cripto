export default function useAdminReferrals() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAllReferrals = async () => {
    const response = await $fetch(`${apiPath}/api/admin/affiliate/referral`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getReferralById = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/referral/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAllNodes = async () => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/referral/nodes`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const getNodeByUserId = async (userId) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/referral/nodes/${userId}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateReferralStatus = async (id: number, status: string) => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/referral/${id}/status`,
      {
        method: 'PUT',
        body: { status },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const getReferralStats = async () => {
    const response = await $fetch(
      `${apiPath}/api/admin/affiliate/referral/stats`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAllReferrals,
    getReferralById,
    updateReferralStatus,
    getReferralStats,
    getAllNodes,
    getNodeByUserId,
  }
}
