export default function useUserPaymentMethods() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserPaymentMethods = async () => {
    const response = await $fetch(`${apiPath}/api/p2p/payment-methods`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserPaymentMethod = async (id) => {
    const response = await $fetch(`${apiPath}/api/p2p/payment-methods/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createUserPaymentMethod = async (
    name,
    instructions,
    currency,
    image,
  ) => {
    const response = await $fetch(`${apiPath}/api/p2p/payment-methods`, {
      method: 'POST',
      body: { name, instructions, currency, image },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteUserPaymentMethod = async (id) => {
    const response = await $fetch(`${apiPath}/api/p2p/payment-methods/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateUserPaymentMethod = async (
    id,
    name,
    instructions,
    currency,
    image,
  ) => {
    const response = await $fetch(`${apiPath}/api/p2p/payment-methods/${id}`, {
      method: 'PUT',
      body: { name, instructions, currency, image },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    getUserPaymentMethods,
    getUserPaymentMethod,
    createUserPaymentMethod,
    deleteUserPaymentMethod,
    updateUserPaymentMethod,
  }
}
