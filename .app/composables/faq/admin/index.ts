export default function useAdminFaqs() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminFaqAnalytics = async () => {
    const response = await $fetch(`${apiPath}/api/admin/faq/analytics`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminFaqAnalytics,
  }
}
