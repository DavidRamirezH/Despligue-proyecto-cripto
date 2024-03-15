export default function useAdminMailWizardCampaigns() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getCampaigns = async () => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/campaigns`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getCampaign = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/campaigns/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const createCampaign = async (name, subject, speed, templeteId, targets) => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/campaigns`, {
      method: 'POST',
      body: { name, subject, speed, templeteId, targets },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateCampaign = async (
    id,
    name,
    subject,
    speed,
    templeteId,
    targets,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/campaigns/${id}`,
      {
        method: 'PUT',
        body: { name, subject, speed, templeteId, targets },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteCampaign = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/campaigns/${id}`,
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

  const updateCampaignStatus = async (id, status) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/campaigns/${id}/status`,
      {
        method: 'PUT',
        body: { status },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
  }
}
