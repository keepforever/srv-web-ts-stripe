import * as Stripe from "stripe"
import "dotenv/config"

// suffix "!" to tell typescript we know it will be defined. 
export const stripe = new Stripe(process.env.STRIPE_SECRET!)