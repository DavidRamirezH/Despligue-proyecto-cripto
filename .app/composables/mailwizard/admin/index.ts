export default function useAdminMailWizard() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminMailwizardAnalytics = async () => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/analytics`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getAdminMailwizardAnalytics,
  }
}
