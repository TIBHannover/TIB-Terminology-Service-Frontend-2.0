import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyDetail from "./components/Ontologies/OntologyDetail/OntologyDetail";
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import Documentation from "./components/Documentation/Documentation";
import Collections from "./components/Collection/Collection";
import Imprint from '../src/assets/static/imprint' 
import PrivacyPolicy from '../src/assets/static/PrivacyPolicy';
import TermsOfUse from '../src/assets/static/TermsOfUse';
import AboutApi from '../src/assets/static/AboutApi';
import './components/layout/general.css';
import About from "./components/About/About";
import Help from "./components/Help/Help";



function App() {
  return (
    <div className="App">
     
      <BrowserRouter>
        <Header />
        <div className='application-content'>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/ts" component={Home}/>
            <Route exact path="/ontologies" component={OntologyList}/>
            <Route exact path="/collections" component={Collections}/>
            <Route exact path="/ontologies/:ontologyId/:tab?" component={OntologyDetail}/>
            <Route exact path="/documentation" component={Documentation}/>
            <Route exact path="/search" component={SearchResult} />
            <Route exact path="/imprint" component={Imprint}/>
            <Route exact path="/PrivacyPolicy" component={PrivacyPolicy} />
            <Route exact path="/TermsOfUse" component={TermsOfUse}/>
            <Route exact path="/AboutApi" component={AboutApi}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/help" component={Help}/>
          </Switch>
        </div>        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
