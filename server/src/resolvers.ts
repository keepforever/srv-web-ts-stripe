import { IResolvers } from 'graphql-tools';
import { User } from './entity/User';
import * as bcrypt from 'bcryptjs';
import { stripe } from './stripe'

export const resolvers: IResolvers = {
  Query: {
    hello: () => "hi",
    me: (_,__, { req } ) => {
      if(!req.session.userId) {
        console.log('no user id session')
        return null
      }
      
      return User.findOne(req.session.userId)
    }
  }, 
  Mutation: {
    // first arg, "parent", we pass "_" because don't care about it
    register: async (_, {email, password}) => {
      // hash password for security, bcrypt.hash() is async func
      const hashedPassword = await bcrypt.hash(password, 10 )
      await User.create({
        email, 
        password: hashedPassword
      // must call save to persist user in the Database. 
      }).save()
      // return true because we specified a "Boolean" in Mutation def
      return true
    },
    login: async (_, {email, password}, { req }) => {
      
      // verify email and password match database entry
      // use findOne() over find() in this use case. 
      // find() is for many results and returns an array
      const user = await User.findOne({ where: { email } });
      if(!user) {
        return null
      }

      // make sure password is correct
      const valid = await bcrypt.compare(password, user.password)

      if(!valid) {
        return null
      }

      // express sessions knows to add a cookie to the user
      req.session.userId = user.id

      return user
    },
    createSubscription: async (_, { source }, { req } ) => {
      // only allow subscriptions to be created for logged in 
      // users. 
      if(!req.session || !req.session.userId) {
        throw new Error(`
        resolvers.ts: createSubscription
        ********************************
        not authenticated
        `)
      }

      const user =  await User.findOne(req.session.userId)

      if(!user) {
        throw new Error()
      }

      const customer = await stripe.customers.create({
        email: user.email,
        source,
// we want to subscribe user to our paid plan. this plan has to
// be created in the Stripe dashboard. the value passed to 'plan'
// should be the plan ID. plan id and product id are different.
// click on "Pricing plans" in the Stripe dashboard to view
// plan ID. 
        plan: process.env.STRIPE_TEST_PLAN_ID
      })
      
      user.stripeId = customer.id
      user.type = 'paid'

      //persist updated fields to database
      await user.save()

      return user

    }
  }
}