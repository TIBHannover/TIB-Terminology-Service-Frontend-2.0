import {render, screen} from '@testing-library/react';
import { createMemoryHistory } from "history";
import OntologyList from '../components/Ontologies/OntologyList/OntologyList';



test("List has ontology", async ()=>{
    const propsLocation = {pathname: "/ts/ontologies", search: "?page=1"};
    const history = createMemoryHistory();
    render(<OntologyList location={propsLocation} history={history} />);
         
    const testOntologyDescription = "The base ontology of the test Standard.";
    await screen.findByText(testOntologyDescription);    
});
