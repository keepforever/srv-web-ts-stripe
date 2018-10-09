// import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as session from "express-session";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

// graphiql endpoint for local development: 
// http://localhost:4000/graphql

const startServer = async () => {
  const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    // on the request object there is a session because 
    // of the middleware we added. 
    context: ({ req }: any) => ({ req })
  });

  await createConnection();

  const app = express();

  app.use(
    session({
      secret: "asdjlfkaasdfkjlads",
      // resave constantly resaves session even if it didn't change
      // we don't want that behavior.
      resave: false,
      // wait until we have data before assigning a user a session
      saveUninitialized: false
    })
  );

  server.applyMiddleware({ app }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`

    The Server ready at http://localhost:4000${server.graphqlPath}
    
    `)
  );
};

startServer();