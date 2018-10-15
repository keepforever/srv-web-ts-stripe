import * as Stripe from "stripe"

console.log(process.env.STRIPE_SECRET!);


// suffix "!" to tell typescript we know it will be defined. 
export const stripe = new Stripe(process.env.STRIPE_SECRET!)