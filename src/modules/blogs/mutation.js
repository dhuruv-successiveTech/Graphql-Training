import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = "dcr295";
export const blogMutationResolvers = {
  register: async (_, { name, email, password }, { models }) => {
    // const models = dataSources.blog.models;
    const isExist = await models.User.findOne({ email });
    if (isExist) {
      return {
        __typename: "Error",
        message: "Email already registered",
        code: 400,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new models.User({
      name,
      email,
      password: hashedPassword,
      posts: [],
      comments: [],
    });
    await newUser.save();
    return {
      __typename: "AuthPayload",
      user: newUser.toObject(),
    };
  },
  login: async (_, { email, password }, { models }) => {

    const user = await models.User.findOne({ email });
    if (!user) {
      return {
        __typename: "Error",
        message: "Invalid credentials",
        code: 401,
      };
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        __typename: "Error",
        message: "Invalid credentials",
        code: 401,
      };
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    return {
      __typename: "AuthPayload",
      token,
      user: user.toObject(),
    };
  },
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

    const populatedPost = await models.Post.findById(post._id).populate(
      "author"
    );
    return {
      __typename: "Post",
      ...populatedPost.toObject(),
    };
  },

  addComment: async (_, { postId, userId, text }, { models, pubsub }) => {
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

    user.comments.push(comment._id);
    post.comments.push(comment._id);

    await user.save();
    await post.save();

    const populatedComment = await models.Comment.findById(comment._id)
      .populate("author")
      .populate("post");

    pubsub.publish("COMMENT_POSTED", {
      commentPosted: populatedComment,
    });
    return {
      __typename: "Comment",
      ...populatedComment.toObject(),
    };
  },
};
