import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyPage from './components/Ontologies/OntologyPage/OntologyPage';
import Home from "./components/Home/Home";
import SearchResult from './components/Search/SearchResult/SearchResult';
import Documentation from "./components/Documentation/Documentation";
import Collections from "./components/Collection/Collection";
import Imprint from '../src/assets/static/imprint' 
import PrivacyPolicy from '../src/assets/static/PrivacyPolicy';
import TermsOfUse from '../src/assets/static/TermsOfUse';
import AboutApi from '../src/assets/static/AboutApi';
import About from "./components/About/About";
import Help from "./components/Help/Help";
import UsagePage from './components/Usage/Usage';
import SubmitedIssueRequests from './components/User/SubmitedIssueRequests/SubmitedIssueRequests';
import UserProfile from './components/User/Profile/Profile';
import RequireLoginRoute from './components/User/Login/RequireLoginRoute';
import Login from './components/User/Login/TS/Login';
import Sitemap from './components/Sitemap/Sitemap';
import {Route, Switch} from 'react-router-dom';




const AppRouter = () => {

    return (
        <Switch>
            <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home}/>
            <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/login"} component={Login}/>    
            <RequireLoginRoute  path={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"} component={UserProfile}/>
            <RequireLoginRoute  path={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"} component={SubmitedIssueRequests}/>
            <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList}/>            
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
            <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/sitemap"} component={Sitemap}/>
            {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections}/>
            }
            {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && 
                <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"} component={UsagePage}/>
            }
        </Switch>   
    );
}

export default AppRouter;