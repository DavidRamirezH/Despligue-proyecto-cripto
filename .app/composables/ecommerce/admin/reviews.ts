export default function useAdminReviews() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminReviews = async () => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/reviews`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminReview = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/reviews/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminReview = async (
    id: number,
    rating: number,
    comment: string,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/reviews/${id}`,
      {
        method: 'PUT',
        body: { rating, comment },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminReview = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/reviews/${id}`,
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
    getAdminReviews,
    getAdminReview,
    updateAdminReview,
    deleteAdminReview,
  }
}
