Task:
Address the performance issues of the ontology term page.

Target scripts:
- "src/components/Ontologies/OntologyPage/OntologyPage.tsx"
- "src/components/Ontologies/TermDetail/TermDetail.tsx"

Details:
- The performance report says:
```Split ontology tabs so heavy optional features load only when selected.

   Good first candidates:

   - OnDeT timeline (`diff2html`, `react-markdown`)
   - Graph views (`vis-network`, `vis-data`)
   - Notes and request forms that depend on rich text editor libraries
```

Points:
- contain the changes to the mentioned components only unless changing them creates typescript errors
- you can lookup other components if nessesary
- do not change the code functionality and components shape


Acceptance criteria:
- typescript build should be error free
- aske me to check the outcome before moving the spec to completed
