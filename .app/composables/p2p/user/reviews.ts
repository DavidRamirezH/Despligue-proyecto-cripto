export default function useUserP2PReviews() {
  const apiPath = useRuntimeConfig().public.apiPath

  const createUserP2PReview = async (trade_id, rating, comment) => {
    const response = await $fetch(`${apiPath}/api/p2p/reviews/${trade_id}`, {
      method: 'POST',
      body: { rating, comment },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    createUserP2PReview,
  }
}
