
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
      const token = req.headers.authorization;
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

  //   useServer(
  //     {
  //       schema,
  //       onConnect: async (ctx) => {
  //         const authHeader = ctx.connectionParams?.authorization || "";
  //         const token = authHeader.split(" ")[1];
  //         let user = null;

  //         if (token) {
  //           try {
  //             const decoded = jwt.verify(token, jwtSecret);
  //             user = await User.findById(decoded.userId);
  //           } catch (err) {
  //             console.error("Invalid token",err);
  //             return false;
  //           }
  //         }

  //         if (!user) {
  //           return false;
  //         }

  //         // Use a unique key for this connection — fallback to websocket key header
  //         const connectionKey =
  //           ctx.connectionParams.connectionId ||
  //           ctx.extra.request.headers["sec-websocket-key"];

  //         activeUsers.set(connectionKey, user);

  //         pubsub.publish("USER_PRESENCE", {
  //           userPresence: {
  //             userId: user.id,
  //             name: user.name,
  //             status: "JOINED",
  //           },
  //         });

  //         return {
  //           userId: user.id,
  //           user,
  //           pubsub,
  //         };
  //       },

  //       onDisconnect: async (ctx, code, reason) => {
  //         // Identify user by connection key to publish leave status
  //         const connectionKey =
  //           ctx.connectionParams.connectionId ||
  //           ctx.extra.request.headers["sec-websocket-key"];

  //         const user = activeUsers.get(connectionKey);

  //         if (user) {
  //           pubsub.publish("USER_PRESENCE", {
  //             userPresence: {
  //               userId: user.id,
  //               name: user.name,
  //               status: "LEFT",
  //             },
  //           });
  //           activeUsers.delete(connectionKey);
  //         }
  //       },
  //     },
  //     wsServer
  //   );

  useServer(
    {
      schema,

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

        return {pubsub}
      },
    },
    wsServer
  );

  return httpServer;
}

export const createApolloServer = createExpressServer;
