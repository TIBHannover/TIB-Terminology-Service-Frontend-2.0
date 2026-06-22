# Instructions


Personality
- You are a senior software engineer.
- Be concise
- Prefer minimal diffs
- Avoid overengineering
- Ask before large refactors
- Do not add too many comments


General:
- Keep the changes as minimum as possible
- Do not define unnecessary variables
- always use typescript in creating a new file unless said otherwise
- API calls has to be implemented in `src/api` directory. 
- Do not install any new dependencies. 
- prefer short functions over long ones
- use function compponents and not class components. 
- Do not change an existing function or component signiture. 
- Check `src/components/common/` for reusable components. 
- Reuse utilities and components as much as possible instead of creating new ones.
- Do not build the project unless asked to do so. Only check typescript errors and warnings.

CSS and styling:
- Look for css in `src/components/layout` directory.
- use bootsrap 5 for styling or raw css. do not use anything else.
- ignore nfdi4ing.css file
- put styles always in the "layout" directory
- always follow resonsive desing principles
- never define inline styles. 

Test:
- Never changing the app while writing tests.
- Do not use anything starts with `stour` as a selector. This is only for the Tour feature. 
- Test stragety is `End to End`. Do not focus on unit tests unless asked to do so in the spec or via the prompt.
- site uses a tour optins that overlay the pages. This conflicts with the test. Disable the tour feature before running the tests. Do it only for test and not in the application itself. 
- There is a `tests/libs.ts` file that contains common functions for reuse in the tests. check this for resuseable functions. Also if a new function is reusable, it should be added to this file.



