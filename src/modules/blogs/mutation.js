export const blogMutationResolvers = {
  addUser: async (_, { name, email }, { dataSources }) => {
  const models = dataSources.blog.models;

  const existing = await models.User.findOne({ email });
  if (existing) {
    return {
      __typename: "Error",
      message: "User with this email already exists",
      code: 400,
    };
  }

  const user = new models.User({
    name,
    email,
    posts: [],
    comments: [],
  });

  await user.save();

  return {
    __typename: "User",
    ...user.toObject(),
  };
}
,

  updateUser: async (_, { id, name, email }, { models }) => {
    const user = await models.User.findById(id);
    if (!user) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    return {
      __typename: "User",
      ...user.toObject(),
    };
  },

  deleteComment: async (_, { id }, { models }) => {
    const comment = await models.Comment.findById(id)
      .populate("author")
      .populate("post");

    if (!comment) {
      return {
        __typename: "Error",
        message: "Comment not found",
        code: 404,
      };
    }

    // Remove comment from user and post
    await models.User.findByIdAndUpdate(comment.author._id, {
      $pull: { comments: comment._id },
    });

    await models.Post.findByIdAndUpdate(comment.post._id, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    return {
      __typename: "Comment",
      ...comment.toObject(),
    };
  },

  addPost: async (_, { userId, title, content }, { models }) => {
    const user = await models.User.findById(userId);
    if (!user) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }

    const post = new models.Post({
      title,
      content,
      date: new Date().toISOString(),
      author: user._id,
      comments: [],
    });

    await post.save();

    user.posts.push(post._id);
    await user.save();

    const populatedPost = await post.populate("author");

    return {
      __typename: "Post",
      ...populatedPost.toObject(),
    };
  },

  addComment: async (_, { postId, userId, text }, { models }) => {
    const user = await models.User.findById(userId);
    if (!user) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }

    const post = await models.Post.findById(postId);
    if (!post) {
      return {
        __typename: "Error",
        message: "Post not found",
        code: 404,
      };
    }

    const comment = new models.Comment({
      text,
      author: user._id,
      post: post._id,
    });

    await comment.save();

    // Add references
    user.comments.push(comment._id);
    post.comments.push(comment._id);

    await user.save();
    await post.save();

    const populatedComment = await comment.populate("author").populate("post");

    return {
      __typename: "Comment",
      ...populatedComment.toObject(),
    };
  },
};
