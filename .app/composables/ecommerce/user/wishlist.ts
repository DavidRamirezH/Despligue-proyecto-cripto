export default function useUserWishlist() {
  const apiPath = useRuntimeConfig().public.apiPath

  // Function to get the user's wishlist
  const getWishlist = async () => {
    const response = await $fetch(`${apiPath}/api/ecommerce/wishlist`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  // Function to add a product to the user's wishlist
  const addToWishlist = async (productId: number) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/wishlist/add`, {
      method: 'POST',
      body: { product_id: productId },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  // Function to remove a product from the user's wishlist
  const removeFromWishlist = async (productId: number) => {
    const response = await $fetch(
      `${apiPath}/api/ecommerce/wishlist/remove/${productId}`,
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
    getWishlist,
    addToWishlist,
    removeFromWishlist,
  }
}
