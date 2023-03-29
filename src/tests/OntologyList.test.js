import {render, screen, waitFor} from '@testing-library/react';
import OntologyList from '../components/Ontologies/OntologyList/OntologyList';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import App from '../App';



test("List has ontology", async ()=>{    
    render(<OntologyList />);
         
    const testOntologyDescription = "The base ontology of the test Standard.";
    await screen.findByText(testOntologyDescription);    
});
