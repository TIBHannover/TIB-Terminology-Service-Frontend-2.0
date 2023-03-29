import '@testing-library/jest-dom';
import {server} from './tests/MockBackend/Server';


setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
jest.setTimeout(100000);





const originalError = console.error
beforeAll(() => {
  server.listen();
  console.error = (...args) => {
    if (/Warning/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterEach(() => {
  server.resetHandlers();
})

afterAll(() => {
  console.error = originalError;
  server.close();
})