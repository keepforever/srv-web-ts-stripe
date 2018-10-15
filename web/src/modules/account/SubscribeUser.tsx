import * as React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import {
  CreateSubscriptionMutation,
  CreateSubscriptionMutationVariables
} from "../../schemaTypes";

const createSubscriptionMutation = gql`
  mutation CreateSubscriptionMutation($source: String!) {
    createSubscription(source: $source) {
      id
      email
    }
  }
`;

export default class SubscribeUser extends React.PureComponent {
  render() {
    return (
      <Mutation<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>
        mutation={createSubscriptionMutation}
      >
        {mutate => (
          <StripeCheckout
            token={async token => {
              const response = await mutate({
                variables: { source: token.id }
              });
              console.log(response);
            }}
            stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE!}
          />
        )}
      </Mutation>
    );
  }
}

// token we recieve back from sucessufl submission looks like:
//
// card: {id: "card_1DLb0YC4EcCaVjqkdocbt3W6", object: "card", address_city: null, address_country: null, address_line1: null, …}
// client_ip: "45.17.136.244"
// created: 1539628899
// email: "b@b.com"

// THIS ID TOKEN IS WHAT WE CARE ABOUT.  This is what we're going to send to the
// server and use it to tie the user to the credit card.
// id: "tok_1DLb0ZC4EcCaVjqkn7b81DP7"

// livemode: false
// object: "token"
// type: "card"
// used: false
