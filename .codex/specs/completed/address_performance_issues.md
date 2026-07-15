Task:
- address performance issues

Goal:
- the app is using eager imports in `src/Router.tsx` and `src/App.tsx`
- use lazy and suspense from react to address this issue.
- the goal is to load the components only when user actually navigates to them.
- this decreases the initial bundle size and the time to first paint.

Acceptance Criteria:
- ask me to check the code and run the app
