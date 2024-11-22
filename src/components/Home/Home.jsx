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

const Home = () => {
  const appContext = useContext(AppContext);

  const [statsResult, setStatsResult] = useState([]);

  const [isTourOpen, setIsTourOpen] = useState(true);
  const isUserLogin = appContext.user ? true : false;
  let tourSteps = [];
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
  }, []);

  return (
    <>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => { setIsTourOpen(false) }}
        showNumber={false}
        disableInteraction={true}
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