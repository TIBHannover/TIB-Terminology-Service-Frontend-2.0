Task:
- playwright test for collection page
- Target component file is `src/components/Collection/Collection.tsx`

Test:
- Collection cards has to be loaded. 
- Each card must has a loaded collection logo.
- Each card must has a loaded collection title. This title must be clickable and navigate to the collection page. 
- Each card must has a loaded collection description.
- Each card must has a loaded collection project homepage.
- Each card must has a list of ontologies. it should have at least one ontology.
- For collections with more than 8 ontologies, there should be a button to show more ontologies. clicking the button must show all ontologies and the button must be changed to "Show less".
- if `col` property is set in the url, the collection card must be scrolled to the top of the page. Test it with `?col=ESS`
- Each card must has a suggest ontology button named "Suggest an ontology for this collection".
- The collection logo must be clickable and navigate to the ontology list page that is filtered by the collection id.


Acceptance Criteria:
 -  use buxn to run test only for this spec and only for chromium

