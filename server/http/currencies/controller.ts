import { cronLastRunTimes, handleController } from '../../utils'
import { redis } from '../../utils/redis'
import { getCurrencies, getCurrency, updateCurrencyRates } from './queries'

// Function to cache the currencies
export async function cacheCurrencies() {
  const currencies = await getCurrencies()
  await redis.set('currencies', JSON.stringify(currencies), 'EX', 300) // Cache for 5 minutes
}

// Initialize the cache when the file is loaded
cacheCurrencies()

export const controllers = {
  index: handleController(async () => {
    try {
      const cachedCurrencies = await redis.get('currencies')
      if (cachedCurrencies) return JSON.parse(cachedCurrencies)
    } catch (err) {
      console.error('Redis error:', err)
    }
    return await getCurrencies()
  }),

  show: handleController(async (_, params) => {
    try {
      const cachedCurrencies = await redis.get('currencies')
      if (cachedCurrencies) {
        const currencies = JSON.parse(cachedCurrencies)
        const currency = currencies.find((c) => c.id === params.id)
        if (currency) return currency
      }
    } catch (err) {
      console.error('Redis error:', err)
    }
    return await getCurrency(params.id)
  }),

  cron: handleController(async () => {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000 // One hour in milliseconds
    const lastRunTime = cronLastRunTimes.currencies

    // Check if at least an hour has passed since the last run
    if (now - lastRunTime < oneHour) {
      throw new Error('Currencies cron can only run once per hour.')
    }
    try {
      await fetchFiatCurrencyPrices()
      cronLastRunTimes.currencies = now
    } catch (error) {
      throw new Error(error)
    }
  }),
}

export async function fetchFiatCurrencyPrices() {
  const baseCurrency = 'USD'
  const apiKey = process.env.APP_OPENEXCHANGERATES_APP_ID

  try {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=${baseCurrency}`,
    )
    const data = await response.json()

    if (data && data.rates) {
      const exchangeRates = data.rates
      const ratesToUpdate = {}

      const currenciesRaw = await redis.get('currencies')
      if (!currenciesRaw) {
        throw new Error('No currencies data available')
      }

      let currencies
      try {
        currencies = JSON.parse(currenciesRaw)
      } catch (parseError) {
        throw new Error(`Error parsing currencies data: ${parseError.message}`)
      }

      if (!Array.isArray(currencies)) {
        throw new Error('Currencies data is not an array')
      }

      for (const currency of currencies) {
        if (exchangeRates.hasOwnProperty(currency.code)) {
          ratesToUpdate[currency.code] = exchangeRates[currency.code]
        }
      }

      await updateCurrencyRates(ratesToUpdate)
      cacheCurrencies()
    } else {
      console.log('Error fetching fiat currency prices:')
    }
  } catch (error) {
    console.error('Error in fetchFiatCurrencyPrices:', error)
    throw error
  }
}
