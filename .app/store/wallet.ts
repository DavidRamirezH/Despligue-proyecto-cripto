import { defineStore } from 'pinia'
import type { Wallet } from '~~/types'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null as Wallet | null,
    wallets: [] as Wallet[],
    FIAT: [] as Wallet[],
    SPOT: [] as Wallet[],
    loading: false,
    currencyWallet: null as Wallet | null,
    pairWallet: null as Wallet | null,
  }),
  getters: {
    getWallet: (state) => (currency: string) => {
      return state.wallets[currency]
    },
    getFiatWallets: (state) => {
      return Object.values(state.FIAT)
    },
    getSpotWallets: (state) => {
      return Object.values(state.SPOT)
    },
    getFirstFiatWallet: (state) => {
      const fiatWallets = Object.values(state.FIAT)
      return fiatWallets.length > 0 ? fiatWallets[0] : null
    },

    getFirstSpotWallet: (state) => {
      const spotWallets = Object.values(state.SPOT)
      return spotWallets.length > 0 ? spotWallets[0] : null
    },
  },

  actions: {
    async fetchWallets(hasTransaction: boolean = true) {
      const { getWallets } = useWallet()
      this.loading = true
      try {
        const response = await getWallets(hasTransaction)
        let wallets = {}
        if (response.status && response.data?.length > 0) {
          response.data.map((wallet) => {
            wallets[wallet.currency] = wallet
          })
          this.wallets = wallets
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },

    async fetchWalletsByType(type: string, hasTransaction: boolean = true) {
      const { fetchWalletsByType } = useWallet()
      this.loading = true
      try {
        const response = await fetchWalletsByType(type, hasTransaction)
        let wallets = {}
        if (response.status && response.data?.length > 0) {
          response.data.map((wallet) => {
            wallets[wallet.currency] = wallet
          })
          this[type] = wallets
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },

    async fetchWallet(currency: string, type: string) {
      const { fetchWallet } = useWallet()
      try {
        const response = await fetchWallet(currency, type)
        this.wallet = response.data ?? null
      } catch (error) {
        console.log(error)
      }
    },

    async fetchCurrencyWallet(currency: string, type: string) {
      const { fetchWallet } = useWallet()
      try {
        const response = await fetchWallet(currency, type)
        this.currencyWallet = response.data
      } catch (error) {
        console.log(error)
      }
    },

    async fetchPairWallet(currency: string, type: string) {
      const { fetchWallet } = useWallet()
      try {
        const response = await fetchWallet(currency, type)
        this.pairWallet = response.data
      } catch (error) {
        console.log(error)
      }
    },
  },
})
