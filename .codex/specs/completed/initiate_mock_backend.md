Task:
- initiate a mock backend for the ts plugin backend. equivalent to the env value "REACT_APP_MICRO_BACKEND_ENDPOINT"

Points:
- to initiate, add sample endpoint for note creation.
- The app is using this backend to exchange the auth code obtained from auth provider such as GitHub with a token. Take a look at the code in the file "src/libs/AuthLib.ts" for more details.
- mock this process. Some of the future tests such as Note creation requires an authenticated user. 

Acceptance Criteria:
- playwright test should pass for chromium
