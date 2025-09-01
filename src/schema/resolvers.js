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
  Subscription: {
    ...messageModule.Subscription,
    ...blogModule.Subscription,
  },
  Post: {
    author: async (post, _, { dataSources }) => {
      return await dataSources.blog.models.User.findById(post.author);
    },
    comments: async (post, _, { dataSources }) => {
      return await dataSources.blog.models.Comment.find({ post: post._id });
    },
  },
  Comment: {
    author: async (comment, _, { dataSources }) => {
      return await dataSources.blog.models.User.findById(comment.author);
    },
    post: async (comment, _, { dataSources }) => {
      return await dataSources.blog.models.Post.findById(comment.post);
    },
  },
  User: {
    posts: async (user, _, { dataSources }) => {
      return await dataSources.blog.models.Post.find({ author: user._id });
    },
    comments: async (user, _, { dataSources }) => {
      return await dataSources.blog.models.Comment.find({ author: user._id });
    },
  },
  Message: {
    author: async (message, _, { models }) => {
   
      return await models.User.findById(message.author);
    },
    recipent: async (message, _, { models }) => {
      return await models.User.findById(message.recipent);
    },
  },
};
