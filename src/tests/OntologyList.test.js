import {render, screen, waitFor} from '@testing-library/react';
import OntologyList from '../components/Ontologies/OntologyList/OntologyList';



test("List has ontology", async ()=>{
    render(<OntologyList />);
    let x = await screen.findByText("Browse Ontologies");
    // await waitFor(()=> expect(screen.getByText("Browse Ontologies")).toBeInTheDocument(), {timeout:5000});
    screen.debug(x);
});
