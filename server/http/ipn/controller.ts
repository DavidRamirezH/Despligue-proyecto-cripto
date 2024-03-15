/* eslint-disable prettier-vue/prettier */
import Stripe from 'stripe'
import { handleController } from '~~/utils'

const publicUrl = process.env.APP_PUBLIC_URL
const stripeApiKey = process.env.APP_STRIPE_SECRET_KEY
const isProduction = process.env.NODE_ENV === 'production'

const useStripe = () => {
  if (!stripeApiKey) {
    throw new Error('Stripe API key is not set in environment variables.')
  }
  return new Stripe(stripeApiKey)
}

export const controllers = {
  stripe: handleController(async (_, __, ___, ____, body, user) => {
    if (!user) throw new Error('User not authenticated')

    const { amount, currency, taxAmount, flutter } = body

    const stripe = useStripe()

    if (flutter) {
      // Handling for Flutter app
      const totalAmount = amount + taxAmount
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount,
          currency: currency,
        })

        return {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        }
      } catch (error) {
        throw new Error(`Error creating payment intent: ${error.message}`)
      }
    } else {
      // Handling for Web
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: currency,
                product_data: {
                  name: 'Deposit',
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
            {
              price_data: {
                currency: currency,
                product_data: {
                  name: 'Tax',
                },
                unit_amount: taxAmount,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${publicUrl}${
            isProduction ? '' : ':3000'
          }/user/wallets/fiat/deposit/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${publicUrl}${
            isProduction ? '' : ':3000'
          }/user/wallets/fiat/deposit/cancel`,
        })

        return {
          version: (stripe as any).VERSION,
          id: session.id,
          url: session.url,
        }
      } catch (error) {
        throw new Error(`Error creating checkout session: ${error.message}`)
      }
    }
  }),
  stripeVerify: handleController(async (_, __, ___, ____, body, user) => {
    if (!user) throw new Error('User not authenticated')

    const { sessionId } = body
    const stripe = useStripe()

    try {
      // Retrieve the Checkout Session
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const paymentIntentId = session.payment_intent

      // Retrieve the associated Payment Intent, if needed
      const paymentIntent = paymentIntentId
        ? await stripe.paymentIntents.retrieve(paymentIntentId as string)
        : null

      // Retrieve all line items for the session
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)

      // Map line items to the desired format
      const mappedLineItems = lineItems.data.map((item) => ({
        id: item.id,
        description: item.description,
        amount_subtotal: item.amount_subtotal,
        amount_total: item.amount_total,
        currency: item.currency,
        // Add other fields as needed
      }))

      return {
        id: session.id,
        status: paymentIntent ? paymentIntent.status : 'unknown',
        line_items: mappedLineItems,
      }
    } catch (error) {
      throw new Error(
        `Error retrieving session and line items: ${error.message}`,
      )
    }
  }),
}
