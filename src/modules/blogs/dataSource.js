
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

  async getPaginatedPosts({ page, limit, sortByDate }) {
    const sort = sortByDate ? { date: sortByDate === "ASC" ? 1 : -1 } : {};
    return await this.models.Post.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author")
      .populate("comments");
  }

}
