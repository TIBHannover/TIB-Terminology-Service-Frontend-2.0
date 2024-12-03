import { useState, useContext } from "react";
import Tour from 'reactour';
import { getTourProfile, storeTourProfile } from "./controller";
import { AppContext } from "../context/AppContext";
import { tourWelcomeStep } from "./globals";
import { headerTourStepsTibGeneral, homePageTourStepsTibGeneral } from "./tibGeneral";
import { loginInHeaderTourSteps } from "./login";
import { ontologyPageTabTourSteps } from "./ontologypage";


const HOME_PAGE_ID = 'homepage';
const ONTOLOGY_PAGE_ID = 'ontologyOverview';


const SiteTour = (props) => {

  const appContext = useContext(AppContext);
  const isUserLogin = appContext.user ? true : false;
  const tourP = getTourProfile();
  let tourSteps = [];
  const [isTourOpen, setIsTourOpen] = useState(!tourP.homepage ? true : false);


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


  function makeOntologyOverviewTourSteps() {
    let tourSteps = ontologyPageTabTourSteps();
    return tourSteps;

  }


  let currentPage = whichPage();
  if (currentPage === HOME_PAGE_ID) {
    tourSteps = makeHomePageTourSteps();
  } else if (currentPage === ONTOLOGY_PAGE_ID) {
    tourSteps = makeOntologyOverviewTourSteps();
  }


  return (
    <>
      {tourSteps.length !== 0 &&
        <Tour
          steps={tourSteps}
          isOpen={isTourOpen}
          onRequestClose={() => {
            setIsTourOpen(false);
            tourP.homepage = true;
            storeTourProfile(tourP);
          }}
          showNumber={false}
          disableInteraction={true}
          onAfterOpen={() => (document.body.style.overflowY = 'hidden')}
          onBeforeClose={() => (document.body.style.overflowY = 'auto')}
          startAt={0}
        />
      }
      <a className='btn btn-secondary btn-sm site-tour-btn' onClick={() => { setIsTourOpen(true) }}>Guide me</a>
    </>
  );
}

export default SiteTour;
