Task:
- add axiom description for subclass relations in term detail table

Details:
- in the "concepts/class.ts" there is a method called "recursivelyBuildStructure" which is used to build the class structure for the term detail table.
- for the nodes inside the structure that are objects, somethimes there is an axiom fields exists. Example:
'''
http://www.w3.org/2000/01/rdf-schema#subClassOf	
0	
    type	
        0	"reification"
    value	"http://nmrML.org/nmrCV#NMR:1000330"
    axioms	
        0
            http://www.geneontology.org/formats/oboInOwl#is_inferred	"true"
1	"http://purl.obolibrary.org/obo/CHEBI_33579"
2	"http://purl.obolibrary.org/obo/CHEBI_36357"
3	"http://purl.obolibrary.org/obo/CHEBI_76107"
'''

Goal:
- the "recursivelyBuildStructure" method should include the axioms field in the returned object.(if exists)
- for each axiom, check the key and value to have label with the "getLabelForLinkedEntity" method.
- if there is no label, then use the key or value as it is.
- axioms struncture is a list of key-value pairs.


How to render:
- there is an info button in the class detail table for some of the annotations.
- use the same buttons with tooltip text "see axioms".
- the button must show a modal.
- inside the modal, show all the axioms in a list.

Note:
- do this for all the annotations that uses "recursivelyBuildStructure" method.
- if there is no axioms, do not show the button.
- only show axioms in the term detail table. Term list and Termset must not be affected.
- becareful to not break the code when changing shapes and types that "recursivelyBuildStructure" method returns.
