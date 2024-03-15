export default function useAdminOrders() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminOrders = async () => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/orders`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getAdminOrder = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/orders/${id}`,
      {
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminOrderStatus = async (id: number, status: string) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/orders/${id}`,
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

  const updateAdminOrderItem = async (id: number, key: string) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/orders/item/${id}`,
      {
        method: 'PUT',
        body: { key },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminOrder = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/orders/${id}`,
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
    getAdminOrders,
    getAdminOrder,
    updateAdminOrderStatus,
    updateAdminOrderItem,
    deleteAdminOrder,
  }
}
