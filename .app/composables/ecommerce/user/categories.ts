export default function useUserCategories() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserCategories = async () => {
    const response = await $fetch(`${apiPath}/api/ecommerce/categories`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserCategory = async (id: number) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/categories/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getUserCategories,
    getUserCategory,
  }
}
