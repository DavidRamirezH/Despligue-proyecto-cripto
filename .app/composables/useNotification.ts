import type { JSONResponse } from '~~/types'

export default function useNotification() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getNotifications,
    createNotification,
    deleteNotification,
    getNotificationTemplates,
    getNotificationTemplate,
    updateNotificationTemplate,
    testMailer,
  }

  async function getNotifications(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/notifications`, {
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

  async function createNotification(
    notification: Notification,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/notifications`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        notification: notification,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function deleteNotification(id: Number): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/notifications/${id}`, {
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

  async function getNotificationTemplates(): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/notifications`, {
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

  async function getNotificationTemplate(id: number): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/notifications/${id}`, {
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

  async function updateNotificationTemplate(
    id: number,
    newTemplateData: any,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/admin/notifications/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        data: newTemplateData,
      },
    })
    if (!response.status) {
      throw response
    }

    return response
  }

  /**
   * @desc test email
   * @returns {Promise<JSONResponse>}
   */
  async function testMailer(
    name: string,
    email: string,
  ): Promise<JSONResponse> {
    const response = await $fetch(
      apiPath + `/api/admin/notifications/email/test`,
      {
        credentials: 'include',
        headers: {
          'client-platform': 'browser',
        },
        query: {
          name: name,
          email: email,
        },
      },
    )
    if (!response.status) {
      throw response
    }

    return response
  }
}
