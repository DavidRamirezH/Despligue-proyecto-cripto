export default function useUserOrders() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getUserOrders = async () => {
    const response = await $fetch(`${apiPath}/api/ecommerce/orders`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const getUserOrder = async (id: number) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/orders/${id}`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createUserOrder = async (
    productIds: number[],
    quantities: number[],
  ) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/orders/create`, {
      method: 'POST',
      body: { product_ids: productIds, quantities },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createOrder = async (productId: number, discountId: number) => {
    const response = await $fetch(`${apiPath}/api/ecommerce/orders/store`, {
      method: 'POST',
      body: { product_id: productId, discount_id: discountId },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return { createOrder, getUserOrders, getUserOrder, createUserOrder }
}
