Task:
- There is a modal that renders subclass relations axioms in the term detail table.
- the modal currently renders key and value as string: label obtained from the linkedEntities.
- change them to show link (if they are links)
    - check first whether the link is a term link or not. use TermApi.
    - use the ontologyId in the page context to get the ontology Id.
    - if it is not a term link, then render the link as it is.
    - if it is a term link, create an internal link to the term detail page.
        - use `createTermUrl` in the TermLib to create the link.
    - in both cases, open the link in a new tab.

Extra details:
- do not extend `ClassStructureAxiom`. make the term/not_term check on demand when a user opens the axiom modal.
