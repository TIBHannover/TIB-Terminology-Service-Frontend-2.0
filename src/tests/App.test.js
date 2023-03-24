import App from "../App";

it("Test App is running", () => {
    shallow(<App />);
});

it("Test App has header", ()=>{
    let application = shallow(<App />);
    let homeOptionInHeader = <a class="nav-link navbar-item" href="/ts/">Home</a>;
    expect(application.contains(homeOptionInHeader)).toEqual(true); 
});