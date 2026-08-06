Task:
- render math ml as metadata for terms with using ts4nfdi-terminology-service-suite

Details:
- the widget shape is:
    ```
<MathFormulaWidget
  api="https://api.terminology.tib.eu/api/"
  iri="selected_term_iri"
  mathProperty="the_target_property_iri"
  ontologyId="the_current_ontology_id"
/>
    ```
- you can check the ts4nfdi-terminology-service-suite for more details and checking the shape.
- only show this widget for annotations whose property has MathMl format.
- you don't have to run dompurify since the widget handles cleaning the mathml.
- only path the annotaiton key to the widget.
- the target is the term detail table. for both class and individual.


