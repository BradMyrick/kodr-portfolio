import { ApolloClient } from '@apollo/client';
import client from '../client';

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
    mutate: jest.fn(),
    subscribe: jest.fn(),
  })),
  InMemoryCache: jest.fn().mockImplementation(() => ({
    cache: 'mock-cache',
  })),
}));

describe('GraphQL Client', () => {
  it('should create Apollo Client with correct configuration', () => {
    expect(client).toBeDefined();
    expect(ApolloClient).toHaveBeenCalled();
    
    const apolloClientCall = (ApolloClient as jest.Mock).mock.calls[0][0];
    expect(apolloClientCall.uri).toBe('http://localhost:4000/graphql');
    expect(apolloClientCall.cache).toBeDefined();
  });
});
