import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    exhibitCategories {
      id
      name
    }
  }
`;