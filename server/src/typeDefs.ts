import { gql } from 'apollo-server-express';


//Apollo-Server-2 introduces the use of gql tag to define Schema
export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    hello: String!
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): User
    createSubscription(source: String!): User
  }
`

// the createSubscription mutatio will take the 
// token returned from stripe.  Stripe refers to this as "source"
// we pass back a user because we will be updating the User
// on the database.  

// omitting the 'bang' on User allows for nullable return
// in the event of an email/password mis-match

