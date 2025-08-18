import { sleep } from "../../utils/delay.js";

export const blogQueryResolvers = {
  user: async (_, __, context) => {
    const blogs = context.blogContext;
    await sleep(1000);
    if (blogs.length === 0) {
      return [
        {
          __typename: "Error",
          message: "No users found.",
          code: 404,
        },
      ];
    }
    return blogs.map((user) => ({
      __typename: "User",
      ...user,
    }));
  },
  post: async (_, { id }, context) => {
    const blogs = context.blogContext;

    await sleep(800);
    for (let blog of blogs) {
      const userPost = blog.posts.find((p) => p.id === id);
      if (userPost) {
        return {
          __typename: "Post",
          ...userPost,
        };
      }
    }
    return {
      __typename: "Error",
      message: `Post with id '${id}' not found.`,
      code: 404,
    };
  },
  comments: async (_, { id }, context) => {
    await sleep(500);
    const blogs = context.blogContext;
    for (let blog of blogs) {
      const userComment = blog.comments.find((c) => c.id === id);
      if (userComment) {
        return {
          __typename: "Comment",
          ...userComment,
        };
      }
    }
    return {
      __typename: "Error",
      message: `Comment with id '${id}' not found.`,
      code: 404,
    };
  },

  paginatedPosts: async (_, { page, limit, sortByDate }, context) => {
    await sleep(800);
    const blogs = context.blogContext;
    let allPosts = blogs.flatMap((user) => user.posts);


    if (sortByDate) {
      allPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === "ASC" ? dateA - dateB : dateB - dateA;
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return allPosts.slice(start, end);
  },
};
