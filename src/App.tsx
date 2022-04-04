import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
// import OntologyDetail from "./components/Ontologies/OntologyDetail/OntologyDetail";

function App() {
  return (
    <div className="App">
     
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/ontologies" element={<OntologyList/>}/>
          {/* <Route path="/ontologies/:OntologyId" element={<OntologyDetail/>}/> */}
        </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
