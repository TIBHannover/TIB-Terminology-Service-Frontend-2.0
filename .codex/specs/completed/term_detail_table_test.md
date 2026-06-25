
Task:
- write a playwright test to check the term detail table 

Steps:
- check `test/ontology-class-tree-test.spec.ts` to get the idea and pattern.
- test case is exaclty the same.
- The term detail table for the term assay in the ontology vibso must contains:
    - Lable: assay
    - Description: must contains "A planned process that has the objective to produce"
    - Imported From: OBI
    - Also In (partial list):
        - BCO
        - VIBSO
    - CURIE: OBI:0000070
    - Term ID: OBI:0000070
    - fullIRI: http://purl.obolibrary.org/obo/OBI_0000070
    - ontology: vibso
    - SubClass Of: "obsolete planned process
        ( realizes someValuesFrom evaluant role )
        ( has specified input someValuesFrom ( material entity intersectionOf ( has role someValuesFrom evaluant role ) ) )
        ( has specified output someValuesFrom ( data entity intersectionOf ( is about someValuesFrom ( material entity intersectionOf ( has role someValuesFrom evaluant role ) ) ) ) )
        ( achieves_planned_objective someValuesFrom assay objective ) "
    - Equivalent to: "( achieves_planned_objective someValuesFrom assay objective ) "
    - Disjoint with: "    planning
        data transformation"
    - Instances: "Assay_A" 
    - has curation status: "ready for release"
    - editor preferred term: assay
    - example of usage: "Assay the wavelength of light emitted by excited Neon atoms. Count of geese flying over a house."
    -
- Take a look at the term detail table code to be percise.


Acceptance Criteria:
- `bunx playwright test --project=chromium` should pass.

