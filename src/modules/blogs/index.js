import { blogMutationResolvers } from "./mutation.js";
import { blogQueryResolvers } from "./query.js";
import { blogSubscriptionResolvers } from "./subscription.js";

export const blogModule = {
    Query:blogQueryResolvers,
    Mutation:blogMutationResolvers,
    Subscription:blogSubscriptionResolvers
}