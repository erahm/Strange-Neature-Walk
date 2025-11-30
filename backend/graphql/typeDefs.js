import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type ExhibitCategory {
    id: Int!
    name: String!
  }
  
  type Exhibit {
    id: Int!
    name: String!
    description: String!
    category: ExhibitCategory!
    imageUrl: String!
    createdAt: String!
    updatedAt: String!
    createdBy: User!
    updatedBy: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    me: User
    exhibits: [Exhibit!]!
    exhibit(id: Int!): Exhibit
    exhibitCategories: [ExhibitCategory!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createUser(name: String!, email: String!, password: String!, role: String): User!
    updateUser(id: Int!, name: String, email: String, password: String): User!
    deleteUser(id: Int!): User!
    createExhibit(name: String!, description: String!, categoryId: Int!, imageUrl: String!): Exhibit!
    updateExhibit(id: Int!, name: String, description: String, categoryId: Int, imageUrl: String): Exhibit!
    deleteExhibit(id: Int!): Exhibit! 
    createExhibitCategory(name: String!): ExhibitCategory!
    updateExhibitCategory(id: Int!, name: String!): ExhibitCategory!
    deleteExhibitCategory(id: Int!): ExhibitCategory! 
  }
`;
