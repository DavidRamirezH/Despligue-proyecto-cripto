export default function useAdminDiscounts() {
  const apiPath = useRuntimeConfig().public.apiPath

  const getAdminDiscounts = async () => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/discounts`, {
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const createAdminDiscount = async (
    code: string,
    percentage: number,
    validUntil: string,
    productId: number,
  ) => {
    const response = await $fetch(`${apiPath}/api/admin/ecommerce/discounts`, {
      method: 'POST',
      body: {
        code,
        percentage,
        valid_until: validUntil,
        product_id: productId,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const updateAdminDiscount = async (
    id: number,
    code: string,
    percentage: number,
    validUntil: string,
    productId: number,
  ) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/discounts/${id}`,
      {
        method: 'PUT',
        body: {
          code,
          percentage,
          valid_until: validUntil,
          product_id: productId,
        },
        credentials: 'include',
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  const deleteAdminDiscount = async (id: number) => {
    const response = await $fetch(
      `${apiPath}/api/admin/ecommerce/discounts/${id}`,
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
    getAdminDiscounts,
    createAdminDiscount,
    updateAdminDiscount,
    deleteAdminDiscount,
  }
}
