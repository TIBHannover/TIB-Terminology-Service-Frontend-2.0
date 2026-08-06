Task:
- resolve dependencies issues in the project

Details:
- when running `bun run start`, there are some errors
- the errors happened after installing:
  - `bun install @ts4nfdi/terminology-service-suite`
  - `bun install @elastic/eui@115.0.0 @emotion/react@11.13.5 react@18.3.0 react-dom@18.3.0 react-query@3.39.2 axios@1.1.2 moment@2.30.1 @elastic/datemath@5.0.3 @emotion/css@11.13.5 @elastic/eui-theme-borealis@7.0.0`
- fix this deps conflicts.
- also, go through the deps and fix the one that are reported to be vulnerable.


Important:
- Your fixes should not change the code functionality.
- typescript should pass successfully after changes.

