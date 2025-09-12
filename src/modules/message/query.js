import { messages } from "./dataSource.js";

export const messageQueryResolvers = {
  messages: () => messages,
  messageHistory: async (_, __, { models, userId }) => {
    if (!userId) {
      return {
        __typename: "Error",
        message: "User id not found",
      };
    }
    const messages = await models.Message.find({
      $or: [{ author: userId }, { recipent: userId }],
    })
      .populate("author")
      .populate("recipent");

    return messages.map((message) => ({
      __typename: "Message",
      ...message.toObject(),
    }));
  },
};
