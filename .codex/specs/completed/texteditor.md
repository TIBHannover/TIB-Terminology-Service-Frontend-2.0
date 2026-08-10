Task:
- fix issues with the TextEditor component


Details:
- there is a TextEditor.tsx file that uses the react-draft-wysiwyg library
- there are some issues in the rendered editor
   - the border of the editor body is not visible
   - the dropdowns in the editor toolbar are not opening
   - in the contactForm component, the editor height is not enough (on the note creation component is fine)
- besides, in the contactForm component, an error happens only on production (cannot replicate on local dev):
    - O.getKey is not a function
