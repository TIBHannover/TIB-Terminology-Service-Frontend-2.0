import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { Route } from "react-router-dom";
import Ontologies from "./components/Ontologies/Ontologies";
import OntologyDetail from "./components/Ontologies/OntologyDetail/OntologyDetail";

function App() {
  return (
    <div className="App">
      <Header />
      <Route>
        <Route path="/ontologies" element={<Ontologies/>}/>
        <Route path="/ontologies/:OntologyId" element={<OntologyDetail/>}/>
      </Route>
      <Footer />
    </div>
  );
}

export default App;
