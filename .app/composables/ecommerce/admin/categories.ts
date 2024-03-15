export default function useAdminCategories() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminCategories = async () => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/categories`, {
      credentials: 'include',
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminCategory = async (
    name: string,
    description: string,
    image: string,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/categories`, {
      method: 'POST',
      body: { name, description, image },
      credentials: 'include',
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminCategory = async (
    id: number,
    name: string,
    description: string,
    status: string,
    image: string,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/categories/${id}`,
      {
        method: 'PUT',
        body: { name, description, status, image },
        credentials: 'include',
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminCategory = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/categories/${id}`,
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
    getAdminCategories,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
  }
}
