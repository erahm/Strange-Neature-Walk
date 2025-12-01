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
        id
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

export const CREATE_EXHIBIT = gql`
  mutation CreateExhibit($name: String!, $description: String!, $imageUrl: String!, $categoryId: Int!) {
    createExhibit(name: $name, description: $description, imageUrl: $imageUrl, categoryId: $categoryId) {
      id
      name
      description
      imageUrl
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_EXHIBIT = gql`
  mutation UpdateExhibit($id: Int!, $name: String!, $description: String!, $imageUrl: String!, $categoryId: Int!) {
    updateExhibit(id: $id, name: $name, description: $description, imageUrl: $imageUrl, categoryId: $categoryId) {
      id
      name
      description
      imageUrl
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_EXHIBIT = gql`
  mutation DeleteExhibit($id: Int!) {
    deleteExhibit(id: $id) {
      id
    }
  }
`;