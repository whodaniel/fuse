import '@testing-library/jest-dom';

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
  },
} as any;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
