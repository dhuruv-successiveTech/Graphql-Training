import { pubsub } from "../../server/pubsub.js";

export const blogSubscriptionResolvers = {
  commentPosted: {
    subscribe: () => pubsub.asyncIterableIterator(["COMMENT_POSTED"]),
  },
};
