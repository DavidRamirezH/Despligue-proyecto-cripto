export default function useUserFaqEntrie() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getFaqs = async (categoryIdentifier) => {
    const queryParams = categoryIdentifier
      ? `?category=${categoryIdentifier}`
      : ''
    const response = await $fetch(`${apiPath}/api/faq/entries${queryParams}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getFaq = async (id) => {
    const response = await $fetch(`${apiPath}/api/faq/entries/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getFaqs,
    getFaq,
  }
}
