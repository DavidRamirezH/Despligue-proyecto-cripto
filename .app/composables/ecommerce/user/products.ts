export default function useUserProducts() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserProducts = async () => {
    const response = await $fetch(`${apiPath}/api/ecommerce/products`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserProduct = async (id: number) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/products/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getUserProducts,
    getUserProduct,
  }
}
