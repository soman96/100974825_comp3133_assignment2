require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express"); // GraphQL server

const connectDB = require("./src/config/db");
const typeDefs = require("./src/graphql/typeDefs"); // GraphQL schema definitions
const resolvers = require("./src/graphql/resolvers"); // GraphQL resolver functions
const { getUserFromReq } = require("./src/utils/auth");

// Cache the app so DB only connects once across warm Vercel function calls
let cachedApp = null;

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

  return app;
}

// Vercel: export a handler function — this is what Vercel calls on each request
module.exports = async (req, res) => {
  if (!cachedApp) {
    cachedApp = await startServer(); // Only runs once on cold start
  }
  cachedApp(req, res);
};

// Local dev: start the server normally with app.listen()
if (process.env.NODE_ENV !== "production") {
  startServer().then((app) => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  });
}