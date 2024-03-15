import type { JSONResponse } from '~~/types'

export default function useFrontend() {
  const apiPath = useRuntimeConfig().public.apiPath

  return {
    getAdminFrontendSections,
    getFrontendSections,
    getFrontendSection,
    updateFrontendSection,
    updateFrontendSectionStatus,
    getFrontendHtml,
  }

  // User Side: Fetch HTML content
  async function getFrontendHtml(path): Promise<JSONResponse> {
    const response = await $fetch(apiPath + '/api/theme/html', {
      headers: {
        'client-platform': 'browser',
      },
      params: {
        path,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  // Admin & User Side: Fetch all frontend sections
  async function getFrontendSections(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + '/api/frontend', {
      headers: {
        'client-platform': 'browser',
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getAdminFrontendSections(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + '/api/admin/frontend', {
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

  // Admin & User Side: Fetch a single frontend section by ID
  async function getFrontendSection(id: number): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/frontend/${id}`, {
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

  // Admin Side: Update a frontend section by ID
  async function updateFrontendSection(
    id: number,
    section: any,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/frontend/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        section: section,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateFrontendSectionStatus(
    ids: number[],
    status: boolean,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/frontend/status/bulk`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        ids: ids,
        status: status,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }
}
