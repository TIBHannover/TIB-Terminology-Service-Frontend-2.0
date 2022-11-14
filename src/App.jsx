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
import About from "./components/About/About";
import Help from "./components/Help/Help";
import UsagePage from './components/Usage/Usage';
import Login from './components/User/Login/Login';
import UserProfile from './components/User/Profile/Profile';
import RequireLoginRoute from './components/User/Login/RequireLogin';


// import css file based on the target project
process.env.REACT_APP_PROJECT_ID === "general" && import ('./components/layout/General_TIB.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && import ('./components/layout/Nfdi4chem.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && import ('./components/layout/Nfdi4ing.css');


function App() {

  // This part is for changing the faveicon based on the target project.
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
  }
  else if(process.env.REACT_APP_PROJECT_ID === "nfdi4chem"){
    link.href = '/chem_small_logo.png';
    document.title = "NFDI4Chem Terminology Service"
  }
  
  else if(process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
    link.href = '/nfdi4ing_logo.png';
    document.title = "NFDI4Ing Terminology Service"
  }
  else{
    // General 
    document.title = "TIB Terminology Service"
  }

  // check backend is reachable
  let getCallSetting = {method: 'GET', headers: {'Accept': 'text/plain;charset=UTF-8 '}};
  let url = "https://service.tib.eu/ts4tib/api/accessibility";
  fetch(url, getCallSetting).then((res) => res.text()).then((res) => {
    if(res !== "API is Accessible!"){
      document.getElementById("backend-is-down-message").style.display = "block";
    }
    else{
      document.getElementById("backend-is-down-message").style.display = "none";
    }
  }).catch((e)=> {
      document.getElementById("backend-is-down-message").style.display = "block";
  });



  return (
    <div className="App">
      <div class="overlay" id="login-loading">
        <div class="d-flex flex-column align-items-center justify-content-center">  
          <div className="row">
            <div class="spinner-grow text-primary" role="status">
              <span class="sr-only">Login ...</span>
            </div>
          </div>
          <div className="row login-load-text">
            <h2><strong>Login ...</strong></h2>
        </div>                                
        </div>            
      </div>
     
      <BrowserRouter>
        <div className="application-page">
          <Header />
          <div className='container-fluid application-content'>
            <div className='row backend-is-down-message' id="backend-is-down-message">
                <div className='col-sm-12 text-center'>
                <div class="alert alert-danger">
                <strong>Attention: </strong> 
                    We are facing some issues with our services. Therefore, some of the functionalities may not work at the moment.
                </div>
                </div>
            </div>
            <Switch>
              <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home}/> 
              <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/login"} component={Login}/>    
              <RequireLoginRoute  path={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"} component={UserProfile}/>           
              <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList}/>
              {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
              <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections}/>}
              <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/:ontologyId/:tab?"} component={OntologyDetail}/>
              <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"} component={Documentation}/>
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
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
