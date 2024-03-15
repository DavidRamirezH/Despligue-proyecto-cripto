import type { ExchangeCurrency } from '../../../../types'

import prisma from '../../../../utils/prisma'

export async function getCurrencies(): Promise<ExchangeCurrency[]> {
  return prisma.exchange_currency.findMany() as unknown as ExchangeCurrency[]
}

export async function getCurrency(
  id: number,
): Promise<ExchangeCurrency | null> {
  return prisma.exchange_currency.findUnique({
    where: {
      id: id,
    },
  }) as unknown as ExchangeCurrency
}

export async function updateCurrency(
  id: number,
  currencyData: ExchangeCurrency,
): Promise<ExchangeCurrency> {
  return (await prisma.exchange_currency.update({
    where: {
      id: id,
    },
    data: currencyData,
  })) as unknown as ExchangeCurrency
}

export async function updateCurrenciesStatus(
  ids: number[],
  status: boolean,
): Promise<boolean> {
  await prisma.exchange_currency.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: status,
    },
  })
  return true
}

export async function updateCurrencyChains(
  id: number,
  chains: any[],
): Promise<ExchangeCurrency> {
  return (await prisma.exchange_currency.update({
    where: {
      id: id,
    },
    data: {
      chains: chains,
    },
  })) as unknown as ExchangeCurrency
}
