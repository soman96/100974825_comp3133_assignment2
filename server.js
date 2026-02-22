require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express"); // GraphQL server

const connectDB = require("./src/config/db");
const typeDefs = require("./src/graphql/typeDefs"); // GraphQL schema definitions
const resolvers = require("./src/graphql/resolvers"); // GraphQL resolver functions
const { getUserFromReq } = require("./src/utils/auth");

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  await connectDB();

  // Create GraphQL Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,

    debug: false, // Removes extra stack trace

    context: ({ req }) => {
      const user = getUserFromReq(req); // null if no token/invalid token
      return { user };
    },
  });

  await server.start();

  // Mount the GraphQL endpoint
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();