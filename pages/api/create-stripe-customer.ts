import { NextApiRequest, NextApiResponse } from 'next'
import { Stripe } from 'stripe'
import { supabase } from '../../utils/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('You are not authorized to call this API')
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('stripe secret key is not set')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
  })

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  })
  console.log({ ...req.body })

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', req.body.record.id)

  res.send({ message: `stripe customer created: ${customer.id}` })
}

export default handler
