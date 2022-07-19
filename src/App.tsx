import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyDetail from "./components/Ontologies/OntologyDetail/OntologyDetail";
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import Documentation from "./components/Documentation/Documentation";



function App() {
  return (
    <div className="App">
     
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/ontologies" component={OntologyList}/>
          <Route exact path="/ontologies/:ontologyId/:tab?" component={OntologyDetail}/>
          <Route exact path="/documentation" component={Documentation}/>
          <Route exact path="/search" component={SearchResult} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
