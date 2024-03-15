export default function useUserFaqCategories() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getCategories = async () => {
    const response = await $fetch(`${apiPath}/api/faq/categories`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getCategory = async (identifier) => {
    const response = await $fetch(
      `${apiPath}/api/faq/categories/${identifier}`,
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
    getCategories,
    getCategory,
  }
}
