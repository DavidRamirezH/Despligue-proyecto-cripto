export default function useAdminP2PReviews() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminP2PReviews = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/reviews`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminP2PReview = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/reviews/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminP2PReview = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/reviews/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminP2PReviews,
    getAdminP2PReview,
    deleteAdminP2PReview,
  }
}
