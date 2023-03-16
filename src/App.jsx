import React, {useState, useEffect} from 'react';
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyPage from './components/Ontologies/OntologyPage/OntologyPage';
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import Documentation from "./components/Documentation/Documentation";
import Collections from "./components/Collection/Collection";
import Imprint from '../src/assets/static/imprint' 
import PrivacyPolicy from '../src/assets/static/PrivacyPolicy';
import TermsOfUse from '../src/assets/static/TermsOfUse';
import AboutApi from '../src/assets/static/AboutApi';
import About from "./components/About/About";
import Help from "./components/Help/Help";
import UsagePage from './components/Usage/Usage';
import { MatomoWrapper } from './components/Matomo/MatomoWrapper';
import  CookieBanner  from './components/common/CookieBanner/CookieBanner';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import AppHelpers from './AppHelpers';


// import css file based on the target project
process.env.REACT_APP_PROJECT_ID === "general" && import ('./components/layout/General_TIB.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && import ('./components/layout/Nfdi4chem.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && import ('./components/layout/Nfdi4ing.css');



function App() {
  AppHelpers.setSiteTitleAndFavIcon();
  AppHelpers.checkBackendStatus();

  const [loading, setLoading] = useState(true); 
  useEffect(() => {    
    setTimeout( () => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="App">   
     <BrowserRouter>
        <MatomoWrapper> 
          <Header />               
          {loading ? (
            <Skeleton
                count={2}
                wrapper={AppHelpers.InlineWrapperWithMargin}
                inline
                width={600}
                height={200}
                marginLeft={20}
                baseColor={'#f4f2f2'}
            />
          ):(
            <span>
            <div className='container-fluid application-content'>
              <span id="backend-is-down-message-span"></span>
              <CookieBanner />
              <Switch>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home}/>            
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList}/>
                {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections}/>}
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/:ontologyId/:tab?"} component={OntologyPage}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"} component={Documentation}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"} component={Documentation}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/search"} component={SearchResult} />
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"} component={Imprint}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"} component={PrivacyPolicy} />
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"} component={TermsOfUse}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/AboutApi"} component={AboutApi}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"} component={About}/>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"} component={Help}/>
                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && 
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"} component={UsagePage}/>}
            </Switch>
          </div>
          <Footer /> 
          </span>         
          )}              
        </MatomoWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;


