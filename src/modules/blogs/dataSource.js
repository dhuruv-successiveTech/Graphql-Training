export const blogs = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    posts: [
      {
        id: "p1",
        title: "Getting Started with GraphQL",
        content: "GraphQL is a query language for your API...",
        comments: [
          {
            id: "c1",
            text: "Great introduction!",
            author: {
              id: "u2",
              name: "Jane Smith",
              email: "jane.smith@example.com",
            },
          },
        ],
      },
    ],
    comments: [
      {
        id: "c2",
        text: "Thanks for the insights!",
        post: {
          id: "p2",
          title: "Advanced GraphQL Tips",
          content: "In this post, we explore advanced GraphQL patterns...",
        },
      },
    ],
  },
];
