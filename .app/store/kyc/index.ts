import { defineStore } from 'pinia'
import type { Kyc } from '~~/types'

export const useKycStore = defineStore({
  // Unique id of the store across your application
  id: 'kyc',

  // A function that returns a fresh state
  state: () => ({
    kycs: [] as Kyc[],
    selectedKyc: {} as Kyc,
    loading: false,
  }),

  // Optional getters
  getters: {
    count(state) {
      // Getter function to count the number of KYC Records
      return state.kycs.length
    },
  },

  // Actions/Mutations
  actions: {
    async fetchKycs() {
      this.loading = true
      const { getKycs } = useKyc()
      const response = await getKycs()
      if (response.status) {
        this.kycs = response.data
      }
      this.loading = false
    },
  },
})
