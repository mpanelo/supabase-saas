import { GetStaticProps, NextPage } from 'next'
import { Stripe } from 'stripe'

interface PricingProps {
  plans: PricingPlan[]
}

interface PricingPlan {
  id: string
  name: string
  price: number
  interval: Stripe.Price.Recurring.Interval | undefined
  currency: string
}

const Pricing: NextPage<PricingProps> = ({ plans }) => {
  return (
    <div className="mx-auto flex w-full max-w-3xl justify-around py-16">
      {plans.map((plan) => (
        <div key={plan.id} className="h-40 w-80 rounded px-6 py-4 shadow">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            {plan.price / 100} / {plan.interval}
          </p>
        </div>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps<PricingProps> = async () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('stripe secret key is not set')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  })

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async (price): Promise<PricingPlan> => {
      const product = await stripe.products.retrieve(price.product as string)
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount ?? 0,
        interval: price.recurring?.interval,
        currency: price.currency,
      }
    })
  )
  const sortedPlans = plans.sort((a, b) => a.price - b.price)
  return {
    props: {
      plans: sortedPlans,
    },
  }
}

export default Pricing
