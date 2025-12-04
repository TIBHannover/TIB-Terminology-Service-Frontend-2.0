import OntologyList from "./components/Ontologies/OntologyList/OntologyList";
import OntologyPage from './components/Ontologies/OntologyPage/OntologyPage';
import Home from "./components/Home/Home";
import SearchResult from './components/Search/SearchResult/SearchResult';
import Documentation from "./components/Documentation/Documentation";
import Collections from "./components/Collection/Collection";
import Imprint from "./components/Imprint/imprint";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse/TermsOfUse";
import About from "./components/About/About";
import Help from "./components/Help/Help";
import UsagePage from './components/Usage/Usage';
import SubmitedIssueRequests from './components/User/SubmitedIssueRequests/SubmitedIssueRequests';
import UserProfile from './components/User/Profile/Profile';
import RequireLoginRoute from './components/User/Login/RequireLoginRoute';
import UserPanel from "./components/User/Login/UserPanel";
import ReportPanel from "./components/User/Admin/ReportPanel";
import { Route, Switch } from 'react-router-dom';
import UserCollection from "./components/User/Collection/Collection";
import ContactForm from "./components/User/ContactForm/ContactForm";
import OntologySuggestion from "./components/Ontologies/OntologySuggestion/OntologySuggestion";
import TermSetPage from "./components/TermSet/TermSetPage";
import UserTermSetList from "./components/TermSet/UserTermSetList";
import EditTermset from "./components/TermSet/EditTermset";
import NotFoundPage from "./errors/notFound";
import BrowseTermSetList from "./components/TermSet/browseTermsetList";


const AppRouter = () => {

  return (
    <Switch>
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home} />
      <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/login"} component={UserPanel} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"} component={UserProfile} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}
        component={SubmitedIssueRequests} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"} component={ReportPanel} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"} component={UserTermSetList} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/:termsetId/edit"}
        component={EditTermset} />
      <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/:termsetId"} component={TermSetPage} />
      <Route path={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets"} component={BrowseTermSetList} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections"} component={UserCollection} />
      <RequireLoginRoute path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}
        component={OntologySuggestion} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/:ontologyId/:tab?"}
        component={OntologyPage} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"} component={Documentation} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"} component={Documentation} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/search"} component={SearchResult} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"} component={Imprint} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"} component={PrivacyPolicy} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"} component={TermsOfUse} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"} component={About} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"} component={Help} />
      <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"} component={ContactForm} />
      {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
        <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections} />
      }
      {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
        <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"} component={UsagePage} />
      }
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;