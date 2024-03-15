export default function useAdminFaqEntries() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminFaqs = async () => {
    const response = await $fetch(`${apiPath}/api/admin/faq/entries`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminFaq = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/faq/entries/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminFaq = async (
    question: string,
    answer: string,
    category_id: number,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/faq/entries`, {
      method: 'POST',
      body: {
        question,
        answer,
        faq_category_id: category_id,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminFaq = async (
    id: number,
    question: string,
    answer: string,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/faq/entries/${id}`, {
      method: 'PUT',
      body: {
        question,
        answer,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminFaq = async (id) => {
    const response = await $fetch(`${apiPath}/api/admin/faq/entries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminFaqs,
    getAdminFaq,
    createAdminFaq,
    updateAdminFaq,
    deleteAdminFaq,
  }
}
