import { useState, useContext } from "react";
import Tour from 'reactour';
import { getTourProfile, storeTourProfile } from "./controller";
import { AppContext } from "../context/AppContext";
import { tourWelcomeStep } from "./globals";
import { headerTourStepsTibGeneral, homePageTourStepsTibGeneral } from "./tibGeneral";
import { loginInHeaderTourSteps } from "./login";



const SiteTour = (props) => {

  const appContext = useContext(AppContext);
  const isUserLogin = appContext.user ? true : false;
  const tourP = getTourProfile();
  let tourSteps = [];

  let currentUrl = window.location.href;
  let urlPath = currentUrl.split(process.env.REACT_APP_PROJECT_SUB_PATH)[1];
  if (urlPath && urlPath[0] === '/') {
    urlPath = urlPath.substring(1);
  }
  if (!urlPath || urlPath[0] === "?") {
    // homepage url 
    if (process.env.REACT_APP_PROJECT_ID === 'general') {
      tourSteps = tourWelcomeStep();
      tourSteps = tourSteps.concat(headerTourStepsTibGeneral());
      tourSteps = tourSteps.concat(homePageTourStepsTibGeneral())
      if (process.env.REACT_APP_AUTH_FEATURE === "true") {
        tourSteps = tourSteps.concat(loginInHeaderTourSteps(isUserLogin));
      }
    }

  }

  const [isTourOpen, setIsTourOpen] = useState(!tourP.homepage ? true : false);


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
      <a className='btn btn-secondary btn-sm site-tour-btn' onClick={() => { setIsTourOpen(true) }}>Take a tour</a>
    </>
  );
}

export default SiteTour;
