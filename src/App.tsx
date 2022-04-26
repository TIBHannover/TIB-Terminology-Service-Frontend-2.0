import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyDetail from "./components/Ontologies/OntologyDetail/OntologyDetail";
import Home from "./components/Home/Home";



function App() {
  return (
    <div className="App">
     
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/ontologies" component={OntologyList}/>
          <Route exact path="/ontologies/:ontologyId/:tab?" component={OntologyDetail}/>
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
