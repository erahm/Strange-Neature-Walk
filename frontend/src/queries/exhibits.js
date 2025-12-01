import { gql } from '@apollo/client';

export const GET_EXHIBIT_TILES = gql`
  query GetExhibitTiles {
    exhibits {
      id
      name
      imageUrl
    }
  }
`;

export const GET_EXHIBIT = gql`
  query GetExhibit($id: Int!) {
    exhibit(id: $id) {
      name
      description
      category {
        name
      }
      imageUrl
      createdAt
      createdBy {
        name
      }
      updatedBy {
        name
      }
    }
  }
`;
