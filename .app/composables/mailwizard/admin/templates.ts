export default function useAdminMailWizardTemplates() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getTemplates = async () => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/templates`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getTemplate = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/templates/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const createTemplate = async (name, content, design) => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/templates`, {
      method: 'POST',
      body: { name, content, design },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateTemplate = async (id, name, content, design) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/templates/${id}`,
      {
        method: 'PUT',
        body: { name, content, design },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteTemplate = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/templates/${id}`,
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
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}
