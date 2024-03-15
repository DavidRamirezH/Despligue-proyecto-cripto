export default function useUserEcommerceActions() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminEcommerceAnalytics = async () => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/analytics`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminEcommerceAnalytics,
  }
}
