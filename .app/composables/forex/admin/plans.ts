import type { ForexPlan, JSONResponse } from '~~/types'

export default function useAdminForexPlan() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getAdminForexPlans,
    getAdminForexPlan,
    createForexPlan,
    updateForexPlan,
    deleteForexPlan,
    updateForexPlanStatus,
  }

  async function getAdminForexPlans(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/plans`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function getAdminForexPlan(id: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/plans/${id}`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function createForexPlan(plan: ForexPlan): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/plans`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        plan: plan,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateForexPlan(
    id: string,
    plan: ForexPlan,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/plans/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        plan: plan,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function deleteForexPlan(id: string): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/forex/plans/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateForexPlanStatus(
    ids: number[],
    status: boolean,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/forex/plans/update-status`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        body: {
          ids: ids,
          status: status,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }
}
