export default function useUserReviews() {
  const apiPath = useRuntimeConfig().public.apiPath

  const createReview = async (
    productId: number,
    rating: number,
    comment: string,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/ecommerce/reviews/${productId}`,
      {
        method: 'POST',
        body: { rating, comment },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    createReview,
  }
}
