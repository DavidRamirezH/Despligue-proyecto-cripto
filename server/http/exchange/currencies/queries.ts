import type { ExchangeCurrency } from '../../../types'

import prisma from '../../../utils/prisma'

export async function getCurrencies(): Promise<ExchangeCurrency[]> {
  return prisma.exchange_currency.findMany({
    where: {
      status: true,
    },
  }) as unknown as ExchangeCurrency[]
}

export async function getCurrency(
  id: number,
): Promise<ExchangeCurrency | null> {
  return prisma.exchange_currency.findUnique({
    where: {
      id: id,
      status: true,
    },
  }) as unknown as ExchangeCurrency
}

export async function updateCurrencyPricesBulk(
  data: { id: number; price: number }[],
) {
  const updateQueries = data.map((item) => {
    return prisma.exchange_currency.updateMany({
      where: { id: item.id },
      data: { price: item.price },
    })
  })

  try {
    await prisma.$transaction(updateQueries)
    console.log('Bulk update successful')
  } catch (error) {
    console.error('Bulk update failed:', error)
    throw error
  }
}
