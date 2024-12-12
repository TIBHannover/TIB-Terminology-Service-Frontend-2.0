import { useState, useContext } from "react";
import Tour from 'reactour';
import { getTourProfile, storeTourProfile } from "./controller";
import { AppContext } from "../context/AppContext";
import { tourWelcomeStep } from "./globals";
import {
  headerTourStepsTibGeneral,
  homePageTourStepsTibGeneral
} from "./tibGeneral";
import { loginInHeaderTourSteps } from "./login";
import {
  ontologyPageTabTourSteps,
  ontologyOverViewTourSteps,
  treeViewTourSteps,
  individualsListTourSteps
} from "./ontologypage";


const HOME_PAGE_ID = 'homepage';
const ONTOLOGY_PAGE_ID = 'ontologyOverview';


const SiteTour = () => {

  const appContext = useContext(AppContext);
  const isUserLogin = appContext.user ? true : false;
  const tourP = getTourProfile();
  let tourSteps = [];
  let currentPage = whichPage();
  let tourOpenValue = false;
  if (currentPage === HOME_PAGE_ID && !tourP.homepage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && !tourP.ontoPageTabs) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/terms') && !tourP.ontoClassTreePage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/props') && !tourP.ontoPropertyTreePage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/individuals') && !tourP.ontoIndividualPage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/termList') && !tourP.ontoClassListPage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/notes') && !tourP.ontoNotesPage) {
    tourOpenValue = true;
  } else if (currentPage === ONTOLOGY_PAGE_ID && window.location.href.includes('/gitpanel') && !tourP.ontoGithubPage) {
    tourOpenValue = true;
  }


  const [isTourOpen, setIsTourOpen] = useState(tourOpenValue);


  function whichPage() {
    let currentUrl = window.location.href;
    let urlPath = currentUrl.split(process.env.REACT_APP_PROJECT_SUB_PATH)[1];
    if (urlPath && urlPath[0] === '/') {
      urlPath = urlPath.substring(1);
    }
    if (!urlPath || urlPath[0] === "?") {
      return HOME_PAGE_ID;
    } else if (urlPath.includes('ontologies')) {
      return ONTOLOGY_PAGE_ID;
    }
  }


  function makeHomePageTourSteps() {
    let tourSteps = [];
    if (process.env.REACT_APP_PROJECT_ID === 'general') {
      tourSteps = tourWelcomeStep();
      tourSteps = tourSteps.concat(headerTourStepsTibGeneral());
      tourSteps = tourSteps.concat(homePageTourStepsTibGeneral())
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
      expandLeftPaneIfnot();
      tourSteps = tourSteps.concat(treeViewTourSteps("class"));
    } else if (cUrl.includes("/props")) {
      expandLeftPaneIfnot();
      tourSteps = tourSteps.concat(treeViewTourSteps("property"));
    } else if (cUrl.includes("/individuals")) {
      expandLeftPaneIfnot();
      tourSteps = tourSteps.concat(individualsListTourSteps());
    } else if (cUrl.includes("/termList")) {
      tourSteps = tourSteps.concat([]);
    } else if (cUrl.includes("/notes")) {
      tourSteps = tourSteps.concat([]);
    } else if (cUrl.includes("/gitpanel")) {
      tourSteps = tourSteps.concat([]);
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
      } else {
        // ontology overview tab
        tourP.ontoOverViewPage = true;
      }


    }
    setIsTourOpen(false);
    storeTourProfile(tourP);
  }


  if (currentPage === HOME_PAGE_ID) {
    tourSteps = makeHomePageTourSteps();
  } else if (currentPage === ONTOLOGY_PAGE_ID) {
    tourSteps = makeOntologyPageTourSteps();
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
          scrollOffset={-800}
        />
      }
      <a className='btn btn-secondary btn-sm site-tour-btn' id="tour-trigger-btn" onClick={() => { setIsTourOpen(true) }}>Guide me</a>
    </>
  );
}

export default SiteTour;
