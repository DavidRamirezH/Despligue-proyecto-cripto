import type { Investment } from '~~/types'

export const useAiTradingInvestmentStore = defineStore({
  // unique id of the store across your application
  id: 'aiInvestment',

  // a function that returns a fresh state
  state: () => ({
    investments: [] as Investment[],
    activeInvestments: [] as Investment[],
    loading: false,
  }),

  // optional getters
  getters: {
    count(state) {
      // getter function to count Investments
      return state.investments.length
    },
  },

  // actions/mutations
  actions: {
    async fetchActiveInvestments() {
      const { getActiveAITradings } = useAiTrading()
      const response = await getActiveAITradings()
      if (response.status) {
        this.activeInvestments = response.data ?? null
      }
    },
    async fetchInvestments() {
      const { getAITradings } = useAiTrading()
      const response = await getAITradings()
      if (response.status) {
        this.investments = response.data ?? null
      }
    },
  },
})
