import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createUser(name: String!, email: String!, password: String!, role: String): User!
    updateUser(id: Int!, name: String, email: String, password: String): User!
    deleteUser(id: Int!): User!
  }
`;
