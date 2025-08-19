export const blogQueryResolvers = {
  user: async (_, __, { dataSources }) => {
    await sleep(1000);
    const users = await dataSources.blog.getUsers();

    if (!users || users.length === 0) {
      return [
        {
          __typename: "Error",
          message: "No users found.",
          code: 404,
        },
      ];
    }

    return users.map((user) => ({
      __typename: "User",
      ...user.toObject(),
    }));
  },

  post: async (_, { id }, { dataSources }) => {
    await sleep(800);
    const post = await dataSources.blog.getPostById(id);

    if (!post) {
      return {
        __typename: "Error",
        message: `Post with id '${id}' not found.`,
        code: 404,
      };
    }

    return {
      __typename: "Post",
      ...post.toObject(),
    };
  },

  comments: async (_, { id }, { dataSources }) => {
    await sleep(500);
    const comment = await dataSources.blog.getCommentById(id);

    if (!comment) {
      return {
        __typename: "Error",
        message: `Comment with id '${id}' not found.`,
        code: 404,
      };
    }

    return {
      __typename: "Comment",
      ...comment.toObject(),
    };
  }
};
