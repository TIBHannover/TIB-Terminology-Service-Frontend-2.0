Task:
- refactor the ontologyPage.tsx and its children components

Details:
- This is a refactoring task. So the code functionality must not change.
- in the ontologyPage.tsx, we have context data that can be used by all the children components.
- Go through the children components and remove the props that can be set in the context data.
- the goal is to avoid chaining the props to all descendants of the ontologyPage.tsx
- the context is the ontologyPageContext.ts
- This task does not need the test-writer agent. only the reviewer is needed.
