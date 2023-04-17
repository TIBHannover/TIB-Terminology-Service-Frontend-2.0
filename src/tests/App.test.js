import {render, screen} from '@testing-library/react';
import App from '../App';


test("Test The App Home Page is running", ()=>{
    render(<App />);
    let homeInHeaderNavBar = screen.getByText("Home");    
    expect(homeInHeaderNavBar).toBeInTheDocument();
});



