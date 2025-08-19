import { blogModule } from "../modules/blogs/index.js";
import { messageModule } from "../modules/message/index.js";

export const resolvers = {
  Query: {
    ...messageModule.Query,
    ...blogModule.Query
  },
  Mutation: {
    ...messageModule.Mutation,
  },
};
