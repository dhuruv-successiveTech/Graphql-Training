<<<<<<< HEAD
=======

>>>>>>> 66a7fd3c874ff8459af5df464732a7eebfddef5e
import http from "http";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { pubsub } from "./pubsub.js"; // Your pubsub instance
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
       
      const token = req.headers.authorization.split(" ")[1];
    
      if (!token) return null;

      const decoded = jwt.verify(token, jwtSecret);
      return decoded.userId;
    } catch (err) {
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
<<<<<<< HEAD
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
=======

>>>>>>> 66a7fd3c874ff8459af5df464732a7eebfddef5e
      onConnect: async (ctx) => {
        const authHeader = ctx.connectionParams?.authorization || "";
        const token = authHeader.split(" ")[1];
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, jwtSecret);
            user = await User.findById(decoded.userId);
          } catch (err) {
            console.error("Invalid token", err);
            return false;
          }
        }

        if (!user) return false;

        // Store user in ctx.extra so it's accessible during disconnect
        ctx.extra.user = user;

        await pubsub.publish("USER_PRESENCE", {
          userPresence: {
            userId: user.id,
            name: user.name,
            status: "JOINED",
          },
        });

        return { userId: user.id, user, pubsub };
      },

      onDisconnect: async (ctx) => {
        const user = ctx.extra?.user;

        await pubsub.publish("USER_PRESENCE", {
          userPresence: {
            userId: user.id,
            name: user.name,
            status: "LEFT",
          },
        });

        return { pubsub };
      },
    },
    wsServer
  );

  return httpServer;
}

export const createApolloServer = createExpressServer;
