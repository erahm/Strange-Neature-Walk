import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      createdAt
      role
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const CREATE_USER_ADMIN = gql`
  mutation CreateUserAdmin($name: String!, $email: String!, $password: String!, $role: String) {
    createUser(name: $name, email: $email, password: $password, role: $role) {
      id
      name
      email
      role
    }
  }
`