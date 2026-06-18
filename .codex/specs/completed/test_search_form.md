Task:
- Test the search form exists in the page main header
- Target are `SearchForm.tsx`, `RenderSearchForm.tsx` and `KeyboardNavigation.ts`
Criteria:
 - when typing `assay` in the form:
    - There has to be two boxes: one for autocomplete and one for jumpto.
    - Each must contain exactly 5 results.
    - The first box must contains 'assay' as one of the results.
    - The second box must contains 'assay' and term id tag and ontology id tag (all in the same row) as one of the results.
    - User must be able to navigate through the results using the keyboard arrow up and down.
    - results must be clickable.
    - first box result must lead to the search page.
    - second box result must lead to the ontology page. 
    - first box result must have a hovering effect that chagnes the background color. 
    - The search should get triggered both by clicking the `search` button and by pressing enter key.
    - after search, the search query must stay in the search input field and also url must be updated (the `q` in the query string). 
    - The search form checkboxes must be present and must be clickable.
    - The `advanced search` toggle must be present and must be clickable. it must open/close the advanced search section. 

Acceptance criteria:
 -  use buxn to run test only for this spec and only for chromium
