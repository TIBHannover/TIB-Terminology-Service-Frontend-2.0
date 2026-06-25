Task: 
- Write playwright tests for the ontology list component and page
- There is already a test file for this named `ontology-list-test.spec.ts`
- Check this and also add more tests based on the below criteria
- Criteria:
    - should renders atleast 200 ontologies cards.
    - Each card must contain: ontology id tag, title, desccription, Collections links, classes count, properties count, loaded date. 
    - description has to be truncated with a read more button. when clicked, the description must be expanded and the button must change to Read less.
    - The sorting options in the dropdown must present and sort the list properly.
    - There must to two facets on the page: Collection and Subjest. 
    - When click on `NFDI4Chem` collection, the list must be filtered to show only the ontologies that belong to the collection.
       - Here use the Collections links inside the ontology card. `NFDI4Chem` must present in the links. 
    - When click on `General` subjust, the ontology count must be less than 70. 
    - There is a filter by keyword input. Type 'vibso' in it and the ontology card must be filtered to show only the ontology that has 'vibso' in the id tag. 
    - The facets, keyword filter, sort, and page change should:
        - change the url 
        - set automatically when given in a url on the first load
    - Ontology suggestion button named `suggest` must be present on the page.

- Target components:
    - `OntologyList.tsx` 
    - `OntologyListRender.tsx`
    - `OntologyListFacet.tsx`
    - `OntologyListUrlFactory.ts`

Acceptance criteria:
 -  use buxn to run test only for this spec and only for chromium

