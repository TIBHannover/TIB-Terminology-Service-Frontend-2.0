import {render, screen, waitFor} from '@testing-library/react';
import OntologyList from '../components/Ontologies/OntologyList/OntologyList';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import App from '../App';



test("List has ontology", async ()=>{
    const ontologyListEndPoint = "/ontologies?page=1";
    render(
        <MemoryRouter initialEntries={[ontologyListEndPoint]}>
            <OntologyList />
        </MemoryRouter>
    );
    
    // render(<OntologyList />);    
    await screen.findByText("Browse Ontologies");
    // let x = await container.findByText("Loaded:");
    // // await waitFor(()=> expect(screen.getByText("Browse Ontologies")).toBeInTheDocument(), {timeout:5000});
    // screen.debug(container);
});
