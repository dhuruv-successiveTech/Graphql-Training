// export const blogs = [
//   {
//     id: "u1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     posts: [
//       {
//         id: "p1",
//         title: "Getting Started with GraphQL",
//         content: "GraphQL is a query language for your API...",
//         comments: [
//           {
//             id: "c1",
//             text: "Great introduction!",
//             author: {
//               id: "u2",
//               name: "Jane Smith",
//               email: "jane.smith@example.com",
//             },
//           },
//         ],
//       },
//     ],
//     comments: [
//       {
//         id: "c2",
//         text: "Thanks for the insights!",
//         post: {
//           id: "p2",
//           title: "Advanced GraphQL Tips",
//           content: "In this post, we explore advanced GraphQL patterns...",
//         },
//       },
//     ],
//   },
// ];



export class BlogDataSource {
  constructor({ models }) {
    this.models = models;
  }

  async getUsers() {
    return await this.models.User.find().populate("posts").populate("comments");
  }

  async getPostById(id) {
    return await this.models.Post.findById(id).populate("author").populate("comments");
  }

  async getCommentById(id) {
    return await this.models.Comment.findById(id).populate("author").populate("post");
  }


}
