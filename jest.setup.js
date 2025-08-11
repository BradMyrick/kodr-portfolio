// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Configure React Testing Library to suppress act warnings in test environment
global.IS_REACT_ACT_ENVIRONMENT = true;

// Suppress act warnings for async state updates in hooks
const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && 
      (args[0].includes('act(...)') || 
       args[0].includes('not configured to support act')))
    return;
  originalConsoleError(...args);
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
