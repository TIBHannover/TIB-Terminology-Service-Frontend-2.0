import '@testing-library/jest-dom';


setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
jest.setTimeout(100000)

const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})