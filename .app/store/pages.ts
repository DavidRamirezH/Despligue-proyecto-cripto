import type { JSONResponse, Page } from '~~/types'

export const usePageStore = defineStore({
  // unique id of the store across your application
  id: 'pages',

  // a function that returns a fresh state
  state: () => ({
    pages: [] as Page[],
    currentPage: null as Page | null,
    loading: false,
  }),

  // optional getters
  getters: {
    pageCount(state) {
      return state.pages.length
    },
  },

  // actions/mutations
  actions: {
    async fetchPages() {
      this.loading = true
      const { getPages } = usePages()
      const response: JSONResponse = await getPages()
      if (response.status) {
        this.pages = response.data
      }
      this.loading = false
    },

    async fetchPage(pageId: string) {
      const { getPage } = usePages()
      const response: JSONResponse = await getPage(pageId)
      if (response.status) {
        this.currentPage = response.data
      }
    },

    getPageBySlug(slug: string) {
      return this.pages.find((page) => page.slug === slug)
    },
  },
})
