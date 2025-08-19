import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { typeDefs } from "./src/schema/typeDefs.js";
import { resolvers } from "./src/schema/resolvers.js";
import { dbConnect } from "./src/lib/database.js";
import Comment from "./src/models/comment.js";
import Post from "./src/models/post.js";
import User from "./src/models/user.js";
import { BlogDataSource } from "./src/modules/blogs/dataSource.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

await dbConnect();

const { url } = await startStandaloneServer(server, {
  listen: { port: 2040 },
  context: async () => {
    const blogDataSource = new BlogDataSource({
      models: { User, Post, Comment },
    });

    return {
      dataSources: {
        blog: blogDataSource,
      },
    };
  },
});

console.log(`🚀 Server ready at ${url}`);
