# Code metadata


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









