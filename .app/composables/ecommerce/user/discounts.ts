export default function useUserDiscounts() {
  const apiPath = useRuntimeConfig().public.apiPath

  const applyDiscount = async (productId: number, code: string) => {
    const response = await $fetch(
      `${apiPath}/api/ecommerce/discounts/${productId}`,
      {
        method: 'POST',
        credentials: 'include',
        body: {
          code,
        },
      },
    )

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    applyDiscount,
  }
}
