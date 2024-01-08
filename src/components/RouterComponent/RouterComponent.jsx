import OntologyList from '../Ontologies/OntologyList/OntologyList';
import OntologyPage from '../Ontologies/OntologyPage/OntologyPage';
import Home from "../Home/Home";
import SearchResult from '../Search/SearchResult/SearchResult';
import Documentation from "../Documentation/Documentation";
import Collections from "../Collection/Collection";
import Imprint from '../../assets/static/imprint';
import PrivacyPolicy from '../../assets/static/PrivacyPolicy';
import TermsOfUse from '../../assets/static/TermsOfUse';
import AboutApi from '../../assets/static/AboutApi';
import About from "../About/About";
import Help from "../Help/Help";
import UsagePage from '../Usage/Usage';
import { Route, Switch} from 'react-router-dom';


const includeRoutes = () => (
  <Switch>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"} component={Home} sitemapIndex={true} changefreq={"yearly"} priority={1}/>            
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"} component={OntologyList} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"} component={Collections} sitemapIndex={true} changefreq={"yearly"} priority={1}/>}
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/:ontologyId/:tab?"} component={OntologyPage}  sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"} component={Documentation} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"} component={Documentation}  sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/search"} component={SearchResult} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"} component={Imprint} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"} component={PrivacyPolicy} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"} component={TermsOfUse} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/AboutApi"} component={AboutApi} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"} component={About} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"} component={Help} sitemapIndex={true} changefreq={"yearly"} priority={1}/>
    {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && 
    <Route exact path={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"} component={UsagePage} sitemapIndex={true} changefreq={"yearly"} priority={1}/>}
</Switch>
);
export default includeRoutes;
    
