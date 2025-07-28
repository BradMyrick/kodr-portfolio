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
  it('should create an Apollo Client instance', () => {
    expect(client).toBeDefined();
    expect(ApolloClient).toHaveBeenCalled();
  });

  it('should be configured with correct URI', () => {
    const apolloClientCall = (ApolloClient as jest.Mock).mock.calls[0][0];
    expect(apolloClientCall.uri).toBe('http://localhost:4000/graphql');
  });

  it('should use InMemoryCache', () => {
    const apolloClientCall = (ApolloClient as jest.Mock).mock.calls[0][0];
    expect(apolloClientCall.cache).toBeDefined();
    expect(apolloClientCall.cache.cache).toBe('mock-cache');
  });

  it('should use environment variable for URI when available', () => {
    // Save original env
    const originalEnv = process.env.NEXT_PUBLIC_GRAPHQL_URI;
    
    // Set test env
    process.env.NEXT_PUBLIC_GRAPHQL_URI = 'https://api.example.com/graphql';
    
    // Clear module cache and re-import
    jest.resetModules();
    const { ApolloClient: MockedApolloClient } = require('@apollo/client');
    MockedApolloClient.mockImplementation(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      subscribe: jest.fn(),
    }));
    
    // Re-import client
    require('../client');
    
    const apolloClientCall = MockedApolloClient.mock.calls[0][0];
    expect(apolloClientCall.uri).toBe('https://api.example.com/graphql');
    
    // Restore original env
    process.env.NEXT_PUBLIC_GRAPHQL_URI = originalEnv;
  });
});
