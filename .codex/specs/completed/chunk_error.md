Task:
- handle chunk error gracefully

Details:
- When a new deployment happens, the old chunks cached by client are not there anymore.
- therefore the client might get error before fully refreshing the page:  Loading chunk XXXX failed.
- this is due to code splitting in ontologypage.tsx

Solution:
- handle the error gracefully by triggering page refresh when such error occurs
