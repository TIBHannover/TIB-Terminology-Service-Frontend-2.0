import {render, screen} from '@testing-library/react';
import App from '../App';


test("Test The App Home Page is running", ()=>{
    render(<App />);
    
    expect(screen.getByText("Home")).toBeInTheDocument();
});



// let homeOptionInHeader = <a class="nav-link navbar-item" href="/ts/">Home</a>;

