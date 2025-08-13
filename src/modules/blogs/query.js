import { blogs } from "./dataSource.js";

export const blogQueryResolvers = {
  user: () => blogs,
  post: (_, { id }) => {
    for (let user of blogs) {
      const found = user.posts.find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  },
  comments:(_,{id}) => {
    for (let user of blogs) {
      const found = user.comments.find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }
};
