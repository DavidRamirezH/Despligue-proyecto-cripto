export default function useAdminMailWizardBlocks() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getBlocks = async () => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/blocks`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createBlock = async (name, design) => {
    const response = await $fetch(`${apiPath}/api/admin/mailwizard/blocks`, {
      method: 'POST',
      body: { name, design },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateBlock = async (id, name, design) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/blocks/${id}`,
      {
        method: 'PUT',
        body: { name, design },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteBlock = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/mailwizard/blocks/${id}`,
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
    getBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
  }
}
