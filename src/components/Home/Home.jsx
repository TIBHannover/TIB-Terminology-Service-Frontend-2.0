import { useState, useEffect, useContext } from 'react';
import '../layout/home.css';
import { createStatsBox } from './StatsBox';
import { renderHomePage } from "./HomePageContent";
import { getCallSetting } from "../../api/constants";
import Tour from 'reactour';
import { AppContext } from '../../context/AppContext';
import { tibGeneralHomePageTour } from '../../tours/home';

const Home = () => {
  const appContext = useContext(AppContext);

  const [statsResult, setStatsResult] = useState([]);

  const [isTourOpen, setIsTourOpen] = useState(true);
  const isUserLogin = appContext.user ? true : false;
  let tourSteps = [];
  if (process.env.REACT_APP_PROJECT_ID === 'general') {
    tourSteps = tibGeneralHomePageTour(isUserLogin);
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
      />
      <div className="row">
        <div className="col-sm-12">
          {renderHomePage()}
          <div className="row justify-content-center home-page-stats-container">
            {createStatsBox(statsResult)}
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;