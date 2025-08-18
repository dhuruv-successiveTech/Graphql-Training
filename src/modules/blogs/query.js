import { blogs } from "./dataSource.js";

export const blogQueryResolvers = {
  user: () => blogs,
  post: (_, { id }) => {
    for (let blog of blogs) {
      const userPost = blog.posts.find((p) => p.id === id);
      if (userPost) return userPost;
    }
    return null;
  },
  comments: (_, { id }) => {
    for (let blog of blogs) {
      const userComment = blog.comments.find((p) => p.id === id);
      if (userComment) return userComment;
    }
    return null;
  },
};
