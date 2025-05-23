import { useState, useEffect } from 'react';
import '../layout/home.css';
import { createStatsBox } from './StatsBox';
import { getCallSetting } from "../../api/constants";
import RenderHomePage from './HomePageContent';


const Home = () => {

  const [statsResult, setStatsResult] = useState([]);

  async function fetchStats() {
    try {
      let res = await fetch(process.env.REACT_APP_STATS_API_URL, getCallSetting)
      res = (await res.json());
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
      <div className="row">
        <div className="col-sm-12">
          <RenderHomePage />
          <div className="row justify-content-center home-page-stats-container">
            {createStatsBox(statsResult)}
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;