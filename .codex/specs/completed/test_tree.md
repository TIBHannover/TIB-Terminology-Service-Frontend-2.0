Task:
- playwright test for ontology class tree
- There is already a test for ontology class tree. Extend it and change if needed.
- Target components are in `src/components/Ontologies/DataTree`
- Test case is `vibso` ontology: `/ontologies/vibso?lang=en`

Test:
- upon first load:
    - there has to be atleast three nodes in the tree
    - there has to be jumpto input on the top of the page
    - there has to be a `show obsoletes` button. upon clicking it, the tree must show obsoletes. atleast one obsolete term that is inside <s></s>. after clicking the button again, it should change to `hide obsoletes` and remove the obsolete terms from the tree if clicked.
    - There has to be a term named `entity` in the tree.
       - the term should have + icon that when clicked, expands the tree to show the children of the term. 
       - after clicking the + icon, it must chagne to - icon. clicking it again must collapse the tree and revert back to the + icon.
       - the term itself has to be clickable and upon click, the term detail table must be shown.
       - after clicking the term, two new buttons must be visible: `Reset` and `Sub Tree`.
    - Reset button must reset the tree to the initial state. no term selected and term detail table must be hidden.
    - when a term is selected in the tree, the Sub Tree button click must reload the tree to show the sub tree for the selected term. sub tree means there sould be no children for the selected term and term has to be visually selected.
    - typing "assay" in the jumpto and selecting it must both render the sub tree for "assay" and show the term detail table for it. after this, there must be a new button named "shoe siblings". clicking it should render the term "assay" siblings. 
    - The tree has to navigatable via keyboard.
       - Arrow up and down must navigate the tree.
       - Arrow right must expand the selected term and show its children.
       - Arrow left must collapse the selected term and remove its children.
    - there must be a vertical line between the tree and the term detail table that is draggable to left and right.

Acceptance criteria:
-  use buxn to run test only for this spec and only for chromium

