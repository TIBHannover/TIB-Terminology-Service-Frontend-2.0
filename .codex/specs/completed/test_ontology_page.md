Task:
- playwright test for ontology page
- Target component file is `src/components/Ontologies/OntologyPage/OntologyPage.tsx`
- test case is `vibso` ontology: `/ontologies/vibso?lang=en`

Test:
- The default loaded tab has to be `Overview`
- There should be two `Vibrational Spectroscopy Ontology (VIBSO)`
    - one is small and on top of the page. remains visible if one changes the tab
    - the other is larger and specific tot he `Overview` page. 
- The `Overview` page has to have the following information:
    - a description of the ontology that contains: ` The Vibration Spectroscopy Ontology defines technical terms`
    - Metrics:
        - Number of Classes > 0
        - Number of Properties > 0
        - Number of Individuals > 0
    - Table of metadata:
        - Version: string
        - VersionIRI: url (with copy to clipboard button)
        - IRI: url (with copy to clipboard button)
        - HomePage: url (with copy to clipboard button)
        - Issue tracker: url (with copy to clipboard button)
        - License: url (with copy to clipboard button)
        - Creator: string or url (without copy to clipboard button)
        - Imports: list of ontologies. each should be a link to the target ontology page
        - Collections: list of collections. each should be a link to the ontology list page that is filtered by the collection id. 
        - Subsets: list of  strings. in this test should contains `chemistry`
        - Is Skos: boolean. in this test should be `false`
        - Download: a button to download the json file. should have download icon and a text `ontology metadata as json`
        - A `show more information` link that when one clicks on it, it expand the table and the link changes to `show less`.
            - the exapnded area must contains this text: `Additional information from Ontology source`
    - The page must have a button named `show ontology metadata as json` that when clicked, it opens a new tab with url containing `api/v2/ontologies/vibso?lang=en`
    - Tabs must be loaded based on the content of `src/components/Ontologies/OntologyPage/listOfComponentsAsTabs.json`
        - Each tab must be clickable. upon clicking, the page must change to the tab content.
    - On the top bar of the page, there must be:
        - language selector
        - a zoom button that when clicked, it expands the ontology page to full screen. on full screen, the zoom button changes to `exit full screen` and the page returns to its original size.

Acceptance Criteria:
-  use buxn to run test only for this spec and only for chromium
    
