export const messageMutationResolvers = {
  postMessage: async (_, { content }, { pubsub, models, userId }) => {
 
    if (!userId) {
      return {
        __typename: "Error",
        message: "Authentication required",
        code: 401,
      };
    }

    const user = await models.User.findById(userId);

    if (!user) {
      return {
        __typename: "Error",
        message: "User not found",
        code: 404,
      };
    }
    const newMessage = new models.Message({
      content,
      author: user._id,
      createdAt: new Date().toISOString(),
      title: `this is title`,
    });
    await newMessage.save();
    pubsub.publish("MESSAGE_POSTED", {
      messagePosted: newMessage,
    });
    
    return {
      __typename: "Message",
      ...newMessage.toObject(),
    };
  },
};
