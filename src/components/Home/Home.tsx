import { useState, useEffect, useRef } from "react";
import "../layout/home.css";
import { createStatsBox } from "./StatsBox";
import { getCallSetting } from "../../api/constants";
import RenderHomePage from "./HomePageContent";

const Home = () => {
  const [statsResult, setStatsResult] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);

  async function fetchStats() {
    try {
      let res = await fetch(
        process.env.REACT_APP_STATS_API_URL as string,
        getCallSetting,
      );
      let stats: Record<string, number> = {};
      stats = await res.json();
      setStatsResult(stats);
    } catch (e) {
      setStatsResult({});
    }
  }

  useEffect(() => {
    fetchStats();
    document.documentElement.style.overflowX = "inherit";
    document.documentElement.style.scrollBehavior = "inherit";
  }, []);

  useEffect(() => {
    let statsElement = statsRef.current;
    if (!statsElement) {
      return;
    }

    let observer = new IntersectionObserver(
      (entries) => {
        let entry = entries[0];
        if (entry.isIntersecting) {
          statsElement.classList.add("home-reveal-item-visible");
          observer.unobserve(statsElement);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <RenderHomePage />
          <div
            className="row justify-content-center home-page-stats-container home-reveal-item"
            ref={statsRef}
          >
            {createStatsBox(statsResult)}
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
