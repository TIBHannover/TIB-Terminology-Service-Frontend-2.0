import React, {useState, useEffect} from 'react';
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
import { MatomoWrapper } from './components/Matomo/MatomoWrapper';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


// import css file based on the target project
process.env.REACT_APP_PROJECT_ID === "general" && import ('./components/layout/General_TIB.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && import ('./components/layout/Nfdi4chem.css');
process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && import ('./components/layout/Nfdi4ing.css');



function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return [
    <div className='row'>
      <div className='col-sm-6 skeleton-loading-box'>{children}</div>
      <div className='col-sm-6 skeleton-loading-box'>{children}</div>
    </div>    
  ];
}


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
    link.href = 'https://nfdi4ing.de/wp-content/uploads/2020/01/cropped-signet-192x192.png';
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
    if(res !== "API is Accessible!" && !document.getElementById('backend-is-down-message')){      
      let rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      rowDiv.setAttribute('id', 'backend-is-down-message')
      let colDiv = document.createElement('div');
      colDiv.classList.add('col-sm-12');
      colDiv.classList.add('text-center');
      let alertDiv = document.createElement('div');
      alertDiv.classList.add('alert');
      alertDiv.classList.add('alert-danger');
      let text = document.createTextNode("We are facing some issues with our services. Therefore, some of the functionalities may not work at the moment.");
      alertDiv.appendChild(text);
      colDiv.appendChild(alertDiv);
      rowDiv.appendChild(colDiv);
      document.getElementById('backend-is-down-message-span').appendChild(rowDiv);
    }    
  }).catch((e)=> {
      // document.getElementById("backend-is-down-message").style.display = "block";
  });
  

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
                wrapper={InlineWrapperWithMargin}
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
              <Switch>
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home}/>            
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList}/>
                {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections}/>}
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/:ontologyId/:tab?"} component={OntologyDetail}/>
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
