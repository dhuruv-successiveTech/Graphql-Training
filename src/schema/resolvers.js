import { blogModule } from "../modules/blogs/index.js";
import { messageModule } from "../modules/message/index.js";

export const resolvers = {
  Query: {
    ...messageModule.Query,
    ...blogModule.Query,
  },
  Mutation: {
    ...messageModule.Mutation,
    ...blogModule.Mutation,
  },
  // Post: {
  //   author: async (post, _, { dataSources }) => {      
  //     return await dataSources.blog.models.User.findById(post.author);
  //   },
  // },
};
