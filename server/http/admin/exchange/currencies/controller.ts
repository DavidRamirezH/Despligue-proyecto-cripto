import { cacheExchangeCurrencies } from '~~/http/exchange/currencies/controller'
import { handleController } from '~~/utils'
import {
  getCurrencies,
  getCurrency,
  updateCurrenciesStatus,
  updateCurrency,
  updateCurrencyChains,
} from './queries'

export const controllers = {
  index: handleController(async () => {
    return await getCurrencies()
  }),

  show: handleController(async (_, __, params) => {
    return await getCurrency(Number(params.id))
  }),

  update: handleController(async (_, __, params, ___, body) => {
    const response = await updateCurrency(Number(params.id), body.data)
    cacheExchangeCurrencies()
    return response
  }),

  updateStatus: handleController(async (_, __, ___, ____, body) => {
    const response = await updateCurrenciesStatus(body.ids, body.status)
    cacheExchangeCurrencies()
    return response
  }),

  updateChains: handleController(async (_, __, params, ___, body) => {
    const response = await updateCurrencyChains(Number(params.id), body.chains)
    cacheExchangeCurrencies()
    return response
  }),
}
