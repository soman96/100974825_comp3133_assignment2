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

  // Only allow requests from Angular dev server and deployed frontend
  const allowedOrigins = ["http://localhost:4200", process.env.FRONTEND_URL].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow Postman/curl
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true, // Allow Authorization header
    })
  );

  app.use(express.json({ limit: "10mb" })); // 10mb for base64 photo strings

  await connectDB();

  // Create GraphQL server
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

  // Mount the GraphQL endpoint — cors: false prevents Apollo overriding our CORS above
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();