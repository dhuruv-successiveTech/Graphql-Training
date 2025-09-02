<<<<<<< HEAD
// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
// import { typeDefs } from "./src/schema/typeDefs.js";
// import { resolvers } from "./src/schema/resolvers.js";
// import { dbConnect } from "./src/lib/database.js";
// import Comment from "./src/models/comment.js";
// import Post from "./src/models/post.js";
// import User from "./src/models/user.js";
// import { BlogDataSource } from "./src/modules/blogs/dataSource.js";
=======
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
>>>>>>> 3d2badc8256dc605c19214bafb04aee7ef0d6be8

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginLandingPageLocalDefault()],
// });

<<<<<<< HEAD
// await dbConnect();

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 2040 },
//   context: async () => {
//     const blogDataSource = new BlogDataSource({
//       models: { User, Post, Comment },
//     });

//     return {
//       dataSources: {
//         blog: blogDataSource,
//       },
//     };
//   },
// });

// console.log(`🚀 Server ready at ${url}`);

import { dbConnect } from "./src/lib/database.js";
import { createApolloServer } from "./src/server/express.js";

const httpServer = await createApolloServer(4000);
await dbConnect()
httpServer.listen(4000, () => {
  console.log(`🚀 Query/Mutation endpoint: http://localhost:4000/graphql`);
  console.log(`🚀 Subscription endpoint: ws://localhost:4000/graphql`);
});
=======
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
>>>>>>> 3d2badc8256dc605c19214bafb04aee7ef0d6be8
