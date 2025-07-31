import {useState, useContext, useEffect} from "react";
import {useLocation} from "react-router-dom";
import Tour from 'reactour';
import {getTourProfile, storeTourProfile} from "./controller";
import {AppContext} from "../context/AppContext";
import {tourWelcomeStep} from "./globals";
import {
  headerTourStepsTibGeneral,
  homePageTourStepsTibGeneral
} from "./tibGeneral";
import {loginInHeaderTourSteps} from "./login";
import {
  ontologyPageTabTourSteps,
  ontologyOverViewTourSteps,
  treeViewTourSteps,
  individualsListTourSteps,
  classListTourSteps,
  githubPanelTourSteps,
  notesTourSteps
} from "./ontologypage";


const HOME_PAGE_ID = 'homepage';
const ONTOLOGY_PAGE_ID = 'ontologyOverview';


const SiteTour = () => {
  
  const appContext = useContext(AppContext);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState();
  const isUserLogin = !!appContext.user;
  const tourP = getTourProfile();
  
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);
  
  
  function whichPage() {
    let currentUrl = window.location.href;
    let baseUrl = window.location.origin + process.env.REACT_APP_PROJECT_SUB_PATH;
    let urlPath = currentUrl.split(baseUrl);
    if (urlPath.length >= 1) {
      urlPath = urlPath[urlPath.length - 1];
    } else {
      return HOME_PAGE_ID;
    }
    if (urlPath && urlPath[0] === '/') {
      // remove leading / if exists
      urlPath = urlPath.substring(1);
    }
    if (!urlPath || urlPath[0] === "?") {
      return HOME_PAGE_ID;
    } else if (urlPath.includes('ontologies/')) {
      return ONTOLOGY_PAGE_ID;
    } else {
      // the target page does not need a tour button
      return false;
    }
  }
  
  
  function makeHomePageTourSteps() {
    let tourSteps = [];
    if (process.env.REACT_APP_PROJECT_ID === 'general') {
      tourSteps = tourWelcomeStep();
      tourSteps = tourSteps.concat(homePageTourStepsTibGeneral())
      tourSteps = tourSteps.concat(headerTourStepsTibGeneral());
      if (process.env.REACT_APP_AUTH_FEATURE === "true") {
        tourSteps = tourSteps.concat(loginInHeaderTourSteps(isUserLogin));
      }
    }
    return tourSteps;
  }
  
  
  function expandLeftPaneIfnot() {
    let detailPane = document.getElementById('page-right-pane');
    if (!detailPane) {
      let termContainer = document.getElementsByClassName('tree-text-container');
      if (termContainer.length !== 0) {
        termContainer[0].click();
      }
    }
  }
  
  
  function makeOntologyPageTourSteps() {
    let tourSteps = [];
    let cUrl = window.location.href;
    if (cUrl.includes("/terms")) {
      setTimeout(() => {
        !tourP.ontoClassTreePage && expandLeftPaneIfnot();
      }, 1000)
      tourSteps = tourSteps.concat(treeViewTourSteps("class"));
    } else if (cUrl.includes("/props")) {
      setTimeout(() => {
        !tourP.ontoPropertyTreePage && expandLeftPaneIfnot();
      }, 1000)
      tourSteps = tourSteps.concat(treeViewTourSteps("property"));
    } else if (cUrl.includes("/individuals")) {
      setTimeout(() => {
        !tourP.ontoIndividualPage && expandLeftPaneIfnot();
      }, 3000)
      tourSteps = tourSteps.concat(individualsListTourSteps());
    } else if (cUrl.includes("/termList")) {
      tourSteps = tourSteps.concat(classListTourSteps());
    } else if (cUrl.includes("/notes")) {
      tourSteps = tourSteps.concat(notesTourSteps());
    } else if (cUrl.includes("/gitpanel")) {
      tourSteps = tourSteps.concat(githubPanelTourSteps());
    } else {
      // ontology overview tab
      tourSteps = ontologyOverViewTourSteps();
    }
    
    
    if (!tourP.ontoPageTabs) {
      tourSteps = tourSteps.concat(ontologyPageTabTourSteps())
    }
    
    return tourSteps;
  }
  
  
  function onCloseTour() {
    let tourP = getTourProfile();
    if (currentPage === HOME_PAGE_ID) {
      tourP.homepage = true;
    } else if (currentPage === ONTOLOGY_PAGE_ID) {
      tourP.ontoPageTabs = true;
      let cUrl = window.location.href;
      if (cUrl.includes("/terms")) {
        tourP.ontoClassTreePage = true;
      } else if (cUrl.includes("/props")) {
        tourP.ontoPropertyTreePage = true;
      } else if (cUrl.includes("/individuals")) {
        tourP.ontoIndividualPage = true;
      } else if (cUrl.includes("/termList")) {
        tourP.ontoClassListPage = true;
      } else if (cUrl.includes("/notes")) {
        tourP.ontoNotesPage = true;
      } else if (cUrl.includes("/gitpanel")) {
        tourP.ontoGithubPage = true;
      } else if (!cUrl.includes('/ondet')) {
        // ontology overview tab
        tourP.ontoOverViewPage = true;
      }
      
    }
    setIsTourOpen(false);
    storeTourProfile(tourP);
  }
  
  useEffect(() => {
    setCurrentPage(whichPage());
  }, [])
  
  useEffect(() => {
    if (currentPage === HOME_PAGE_ID && !tourP.homepage) {
      setIsTourOpen(true);
    }
  }, [currentPage])
  
  useEffect(() => {
    setCurrentPage(whichPage());
  }, [location])
  
  useEffect(() => {
    if (!isTourOpen) {
      return;
    }
    if (currentPage === HOME_PAGE_ID) {
      setTourSteps(makeHomePageTourSteps());
    } else if (currentPage === ONTOLOGY_PAGE_ID) {
      let cUrl = window.location.href;
      if (cUrl.includes("/terms")) {
        tourP.ontoClassTreePage = false;
      } else if (cUrl.includes("/props")) {
        tourP.ontoPropertyTreePage = false;
      } else if (cUrl.includes("/individuals")) {
        tourP.ontoIndividualPage = false;
      } else if (cUrl.includes("/termList")) {
        tourP.ontoClassListPage = false;
      } else if (cUrl.includes("/notes")) {
        tourP.ontoNotesPage = false;
      } else if (cUrl.includes("/gitpanel")) {
        tourP.ontoGithubPage = false;
      } else if (!cUrl.includes('/ondet')) {
        // ontology overview tab
        tourP.ontoOverViewPage = false;
      }
      storeTourProfile(tourP);
      setTourSteps(makeOntologyPageTourSteps());
    }
  }, [isTourOpen]);
  
  
  if (!currentPage) {
    // do not show the tour button when the page does not need one
    return "";
  }
  
  return (
    <>
      {tourSteps.length !== 0 &&
        <Tour
          steps={tourSteps}
          isOpen={isTourOpen}
          onRequestClose={onCloseTour}
          showNumber={false}
          disableInteraction={true}
          onAfterOpen={() => (document.body.style.overflowY = 'hidden')}
          onBeforeClose={() => (document.body.style.overflowY = 'auto')}
          startAt={0}
          scrollOffset={-500}
        />
      }
      <button
        className='btn site-tour-btn'
        id="tour-trigger-btn"
        onClick={() => {
          setIsTourOpen(true)
        }}
      >
        Guide me
      </button>
    </>
  );
}

export default SiteTour
