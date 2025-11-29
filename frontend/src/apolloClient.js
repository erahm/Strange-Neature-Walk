import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

const API_URL = import.meta.env.VITE_API_URL || '/graphql'

const httpLink = new HttpLink({ uri: API_URL });

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }))
  return forward(operation)
})

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
})
