import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create the Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default client;
