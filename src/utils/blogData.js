const blogs = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    posts: [
      {
        id: "p1",
        title: "Getting Started with GraphQL",
        content: "GraphQL is a query language for your API...",
        date: "2025-08-10T10:30:00Z",
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
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    posts: [
      {
        id: "p2",
        title: "Advanced GraphQL Tips",
        content: "In this post, we explore advanced GraphQL patterns...",
        date: "2025-08-12T14:45:00Z",
        comments: [
          {
            id: "c3",
            text: "Very useful content!",
            author: {
              id: "u3",
              name: "Alice Johnson",
              email: "alice.johnson@example.com",
            },
          },
        ],
      },
      {
        id: "p3",
        title: "GraphQL vs REST",
        content: "Let's compare GraphQL and REST in terms of flexibility and performance...",
        date: "2025-08-15T09:00:00Z",
        comments: [
          {
            id: "c4",
            text: "REST still has its place though.",
            author: {
              id: "u1",
              name: "John Doe",
              email: "john.doe@example.com",
            },
          },
          {
            id: "c5",
            text: "I prefer GraphQL for frontend-heavy apps.",
            author: {
              id: "u3",
              name: "Alice Johnson",
              email: "alice.johnson@example.com",
            },
          },
        ],
      },
    ],
    comments: [
      {
        id: "c1",
        text: "Great introduction!",
        post: {
          id: "p1",
          title: "Getting Started with GraphQL",
          content: "GraphQL is a query language for your API...",
        },
      },
    ],
  },
  {
    id: "u3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    posts: [
      {
        id: "p4",
        title: "Schema Design Best Practices",
        content: "Designing an effective GraphQL schema is crucial...",
        date: "2025-08-16T13:20:00Z",
        comments: [],
      },
    ],
    comments: [
      {
        id: "c3",
        text: "Very useful content!",
        post: {
          id: "p2",
          title: "Advanced GraphQL Tips",
          content: "In this post, we explore advanced GraphQL patterns...",
        },
      },
      {
        id: "c5",
        text: "I prefer GraphQL for frontend-heavy apps.",
        post: {
          id: "p3",
          title: "GraphQL vs REST",
          content: "Let's compare GraphQL and REST in terms of flexibility and performance...",
        },
      },
    ],
  },
];

export default blogs;
