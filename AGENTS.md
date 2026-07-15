# Instructions

before starting:
- Read `.codex/instructions.md`
- Do not read `.codex/specs/completed` 
- Do not read anything from `public/`. Completely ignore it.

Tasks workflow:
- Always look at the `.codex/specs/` unless you are instructed to do otherwise
- inside the `.codex/specs` directory, there are .md files. Each of them is a task.
- inside the `.codex/specs` there is `reports/` directory. If the spec asks for creating reports, put it as .md there.
- If the spec is a report spec, do not change any code. Just create the report.
- The task name has to be said in the prompt. If not, ask for it.
- Do not run multiple tasks at the same time.
- Each task has an accpentance criteria that has to be respected. 
- After finishing a spec, move the spec to `spec/completed` directory.

code structure:
- The components that holds app logic and rendering are in `src/components`
- `src/components/common` holds the common components that are used by multiple components.
- The service layer is in `src/api`. All the api calls has to be here.
- `src/concepts` holds the data models. These are the models that components are using. The service layer return these models and never returns the raw data. 
- `src/context` holds the React contexts blueprints.
- `src/errors` holds the error pages. 
- `src/tours` holds the tours feature.
- `src/UrlFactory` holds the url factory. A component must insteract with the URL only through these libraries.
- tests are in `tests/`. All tests goes here.

Stack:
- React
- Typescript
- CSS/Bootstrap 6









