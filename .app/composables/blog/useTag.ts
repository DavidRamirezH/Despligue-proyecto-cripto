import type { JSONResponse, Tag } from '~~/types'

export default function useTag() {
  const apiPath = useRuntimeConfig().public.apiPath
  return {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
  }

  async function getTags(posts: boolean = true): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/blog/tags`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      query: {
        posts: posts,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function getTag(
    id: number,
    posts: boolean = true,
  ): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/blog/tags/${id}`, {
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      query: {
        posts: posts,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function createTag(tag: Tag): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/blog/tags`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        tag: tag,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function updateTag(id: number, tag: Tag): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/blog/tags/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'client-platform': 'browser',
      },
      body: {
        tag: tag,
      },
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  async function deleteTag(id: number): Promise<JSONResponse> {
    const response = await $fetch(apiPath + `/api/blog/tags/${id}`, {
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
}
