import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { typeDefs } from "./src/schema/typeDefs.js";
import { resolvers } from "./src/schema/resolvers.js";
import { blogContext } from "./src/modules/blogs/dataSource.js";
import { dbConnect } from "./src/lib/database.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

await dbConnect();

const { url } = await startStandaloneServer(server, {
  listen: { port: 2020 },
  context: async () => {
    return { blogContext };
  },
});

console.log(`🚀 Server ready at ${url}`);
