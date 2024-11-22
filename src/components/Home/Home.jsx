import { useState, useEffect, useContext } from 'react';
import '../layout/home.css';
import { createStatsBox } from './StatsBox';
import { renderHomePage } from "./HomePageContent";
import { getCallSetting } from "../../api/constants";
import Tour from 'reactour';
import { AppContext } from '../../context/AppContext';
import { headerTourStepsTibGeneral, homePageTourStepsTibGeneral } from '../../tours/tibGeneral';
import { loginInHeaderTourSteps } from '../../tours/login';
import { tourWelcomeStep } from '../../tours/globals';
import { storeTourProfile, getTourProfile } from '../../tours/controller';

const Home = () => {
  const appContext = useContext(AppContext);
  let tourP = getTourProfile();

  const [statsResult, setStatsResult] = useState([]);
  const [isTourOpen, setIsTourOpen] = useState(!tourP.homepage ? true : false);

  let tourSteps = [];
  const isUserLogin = appContext.user ? true : false;
  if (process.env.REACT_APP_PROJECT_ID === 'general') {
    tourSteps = tourWelcomeStep();
    tourSteps = tourSteps.concat(headerTourStepsTibGeneral());
    tourSteps = tourSteps.concat(homePageTourStepsTibGeneral())
    if (process.env.REACT_APP_AUTH_FEATURE === "true") {
      tourSteps = tourSteps.concat(loginInHeaderTourSteps(isUserLogin));
    }
  }


  async function fetchStats() {
    try {
      let res = await fetch(process.env.REACT_APP_STATS_API_URL, getCallSetting)
      res = (await statsResult.json());
      setStatsResult(res);

    } catch (e) {
      setStatsResult([]);
    }
  }


  useEffect(() => {
    fetchStats();
    document.documentElement.style.overflowX = 'inherit';
    document.documentElement.style.scrollBehavior = 'inherit';
  }, []);

  return (
    <>
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
      <div className="row">
        <div className="col-sm-12">
          {renderHomePage(setIsTourOpen)}
          <div className="row justify-content-center home-page-stats-container">
            {createStatsBox(statsResult)}
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;