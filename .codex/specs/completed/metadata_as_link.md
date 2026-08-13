Task:
- render metadata as link

Details:
- In the detail table for a term `TermDetailTable.tsx`, there are metadata keys.
- These keys are at the moment rendered as strings.
- The parsing happens in `concepts/` and you need modify the parsing there.
- The `metadataParser.tsx` just consumed the parsed metadata to prepare them for rendering.
- How to parse the metadata:
    - the annoation parser must return a type that has iri, label, and value for each metadata key.
    - make sure to apply this anywhere that metadata is consumed to avoid breaking the other functionalities.
- How to render:
    - show an info icon that works as a button. 
    - there is no need for this icon if the metadata only has label an no iri (link).
    - then a user clicks on the button, render this widget in a modal:
        - from ts4nfdi
        - ```
<EntityInfoWidget
  api="https://api.terminology.tib.eu/api/"
  entityType="property"
  hasTitle
  iri="TARGET_IRI"
  onNavigateToDisambiguate={function Pge(){}}
  onNavigateToEntity={function Pge(){}}
  onNavigateToOntology={function Pge(){}}
  ontologyId="CURRENT_ONTOLOGY_ID_IN_CONTEXT"
  parameter=""
  showBadges
/>
        ```
    - fill the values above respectively: iri, ontologyId.
    - take a look at the way mathModWidget is used in `MetadataParser.tsx` to get the idea how to use this libraries widget.


Extra refactor:
- in the `concepts/` parsers, you will encounter many line like `["linkedEntities"][propertyIri]["label"][0];` that get the label from linked entities object.
- refactor all to use a function like `getLabelForLinkedEntity(iri:string)` that returns the label. the funcition must be private. it must returns N/A in case of missing label or exception. 
