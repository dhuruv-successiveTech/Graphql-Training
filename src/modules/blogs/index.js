import { blogMutationResolvers } from "./mutation.js";
import { blogQueryResolvers } from "./query.js";

export const blogModule = {
    Query:blogQueryResolvers,
    Mutation:blogMutationResolvers
}