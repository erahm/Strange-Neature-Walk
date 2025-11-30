import { userQueries } from './resolvers/userQueries.js';
import { userMutations } from './resolvers/userMutations.js';

export const resolvers = {
  Query: {
    ...userQueries
  },
  Mutation: {
    ...userMutations
  }
};
