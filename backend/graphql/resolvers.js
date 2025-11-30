import { userQueries, exhibitQueries, categoryQueries  } from './resolvers/queries/index.js';
import { userMutations, categoryMutations, exhibitMutations } from './resolvers/mutations/index.js';

export const resolvers = {
  Query: {
    ...userQueries,
    ...exhibitQueries,
    ...categoryQueries
  },
  Mutation: {
    ...userMutations,
    ...categoryMutations,
    ...exhibitMutations
  }
};
