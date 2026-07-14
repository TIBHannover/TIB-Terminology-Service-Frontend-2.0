Task:
- write test for the note feature


test ontology: chmo. 
test needs to run the mock backend first.


Tests:

- Note list:
    - click on the Notes tab on the ontology page (the tab must contain the number of notes)
    - it should renders the note list
    - each note card must contain:
        - the note title link to the note page
        - a header containing time and user
        - a section like: About (class): link_to_artifact
        - comment count
        - a three dots button that open a dropdown menu
            - vibsibility
            - copy to clipboard the note link
            - report
            - edit
            - delete


- create a note: "src/components/Ontology/Note/NoteCreation.tsx"
    - On the note list page click on the "add note" button
    - a modal must open
    - note inoformation:
        - target artifact: class
        - visibility: public
        - about: "assay" (need to be selected from the autocomplete dropdown)
        - publish to parent ontology: unchecked
        - title
        - content
    - after the note creation, it should redirect to the new note page with a success message

- update a note: "src/components/Ontology/Note/NoteEdit.tsx"
    - on the note list, click the three dots on the right side of the note card and select "edit"
    - a modal must open showing the current note information
    - edit to:
        - target artifact: class
        - visibility: internal
        - about: "assay output" (need to be selected from the autocomplete dropdown)
        - publish to parent ontology: unchecked
        - new title
        - new content
    - after the note update, it should redirect to the list. the note with new title must be present 

- delete a note:
    - on the note list, click the three dots on the right side of the note card and select "delete"
    - a modal must open as the confirmation
    - after the note deletion, it should redirect to the list.

- note page:
   - must contain the note card
   - must contain note content
   - must contain comment section
   - commenting must be possible


Acceptance Criteria:
- test must pass for chromium




