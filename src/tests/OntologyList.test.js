import {render, screen, waitFor} from '@testing-library/react';
import OntologyList from '../components/Ontologies/OntologyList/OntologyList';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import App from '../App';



test("List has ontology", async ()=>{
    const propsLocation = {pathname: "/ts/ontologies", search: "?page=1"} 
    render(<OntologyList location={propsLocation} />);
         
    const testOntologyDescription = "The base ontology of the test Standard.";
    await screen.findByText(testOntologyDescription);    
});
