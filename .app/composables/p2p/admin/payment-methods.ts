export default function useAdminP2PPaymentMethods() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminPaymentMethods = async () => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/payment-methods`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminPaymentMethod = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/payment-methods/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminPaymentMethod = async (name, instructions, image) => {
    const response = await $fetch(`${apiPath}/api/admin/p2p/payment-methods`, {
      method: 'POST',
      body: { name, instructions, image },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminPaymentMethod = async (
    id,
    name,
    instructions,
    currency,
    image,
    status,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/payment-methods/${id}`,
      {
        method: 'PUT',
        body: { name, instructions, currency, image, status },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminPaymentMethod = async (id) => {
    const response = await $fetch(
      `${apiPath}/api/admin/p2p/payment-methods/${id}`,
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
    getAdminPaymentMethods,
    getAdminPaymentMethod,
    createAdminPaymentMethod,
    updateAdminPaymentMethod,
    deleteAdminPaymentMethod,
  }
}
