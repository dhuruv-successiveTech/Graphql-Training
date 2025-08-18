
export const blogMutationResolvers = {
  updateUser: (_, { id, name, email }, context) => {
    const blogs = context.blogContext;
    const blog = blogs.find((u) => u.id === id);
    if (!blog) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }
    if (name) blog.name = name;
    if (email) blog.email = email;
    return {
      __typename: "User",
      ...blog,
    };
  },
  deleteComment: (_, { id }, context) => {
    const blogs = context.blogContext;
    for (const blog of blogs) {
      const idx = blog.comments.findIndex((c) => c.id === id);
      if (idx !== -1) {
        const deleted = blog.comments.splice(idx, 1)[0];
        return {
          __typename: "Comment",
          ...deleted,
        };
      }
    }
    return {
      __typename: "Error",
      message: "Comment not found",
      code: 404,
    };
  },
  addPost: (_, { userId, title, content }, context) => {
    const blogs = context.blogContext;
    const blog = blogs.find((u) => u.id === userId);
    if (!blog) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }
    const newPost = {
      id: `p${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
      author: blog,
      comments: [],
    };
    blog.posts.push(newPost);
    return {
      __typename: "Post",
      ...newPost,
    };
  },

  addComment: (_, { postId, userId, text }, context) => {
    const blogs = context.blogContext;
    const user = blogs.find((u) => u.id === userId);
    if (!user) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }
    let userPost = null;
    for (const blog of blogs) {
      userPost = blog.posts.find((p) => p.id === postId);
      if (userPost) break;
    }
    if (!userPost) {
      return {
        __typename: "Error",
        message: "Post not found",
        code: 404,
      };
    }
    const newComment = {
      id: `c${Date.now()}`,
      text,
      author: user,
      post: userPost,
    };

    user.comments.push(newComment);
    userPost.comments.push(newComment);

    return {
      __typename: "Comment",
      ...newComment,
    };
  },
};
