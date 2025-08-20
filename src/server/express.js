import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { pubsub } from "./pubsub.js"; // Import the pubsub instance
import jwt from "jsonwebtoken";
import { typeDefs } from "../schema/typeDefs.js";
import { resolvers } from "../schema/resolvers.js";
import { BlogDataSource } from "../modules/blogs/dataSource.js";
import { User, Comment, Post, Message } from "../models/index.js";
const jwtSecret = "dcr295";
export async function createExpressServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();

  const getUserToken = async (req) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return null;
      }
      const decoded = jwt.verify(token, jwtSecret);
      
      return decoded.userId;
    } catch (error) {
      console.error(err.message);
      return null;
    }
  };

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const userId = await getUserToken(req);
        
        const blogDataSource = new BlogDataSource({
          models: { User, Post, Comment, Message },
        });

        return {
          userId,
          pubsub,
          dataSources: {
            blog: blogDataSource,
          },
          models: { User, Post, Comment, Message },
        };
      },
    })
  );

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer(
    {
      schema,
      context: async () => {
        const blogDataSource = new BlogDataSource({
          models: { User, Post, Comment, Message },
        });

        return {
          pubsub,
          dataSources: {
            blog: blogDataSource,
          },
          models: { User, Post, Comment, Message },
        };
      },
    },
    wsServer
  );

  return httpServer;
}

export const createApolloServer = createExpressServer;
