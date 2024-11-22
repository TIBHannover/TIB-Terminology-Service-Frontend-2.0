import { useState, useEffect, useContext } from 'react';
import '../layout/home.css';
import { createStatsBox } from './StatsBox';
import { renderHomePage } from "./HomePageContent";
import { getCallSetting } from "../../api/constants";
import Tour from 'reactour';
import { AppContext } from '../../context/AppContext';

const Home = () => {
  const appContext = useContext(AppContext);

  const [statsResult, setStatsResult] = useState([]);

  const [isTourOpen, setIsTourOpen] = useState(true);
  const tourSelectorPrefix = '.stour-';
  const steps = [
    {
      selector: tourSelectorPrefix + 'searchbox',
      content: 'You can use this to search after ontologies, classes, properties, and individuals.',
    },
    {
      selector: tourSelectorPrefix + 'searchbox-exactmatch',
      content: "You can narrow down your search to be an exact match for your query instead of the default fuzzy search.",
      style: {
        marginLeft: '-50px',
      },
    },
    {
      selector: tourSelectorPrefix + 'searchbox-obsolete',
      content: "Search only in obsolete terms. Obsolete terms are deprecated ones set by the ontology develepers.",
    },
    {
      selector: tourSelectorPrefix + 'searchbox-advanced',
      content: "Set extra properties for your search such as search in a specific sub-tree.",
      style: {
        marginLeft: '150px',
      },
    },

    {
      selector: tourSelectorPrefix + 'collections-navbar-item',
      content: 'Checkout the details about the hosted Collections in TIB.',
    },
    {
      selector: tourSelectorPrefix + 'ontologies-navbar-item',
      content: "Checkout the list of available ontologies.",
    },
    {
      selector: tourSelectorPrefix + 'help-navbar-item',
      content: "Need help? Here you can find the most frequent questions and answers regarding TIB terminology service.",
    },
    {
      selector: tourSelectorPrefix + 'api-navbar-item',
      content: "You plan to use API? check this for the detailed documentation.",
    },
    {
      selector: tourSelectorPrefix + 'about-navbar-item',
      content: "Read more about TIB terminology service.",
    },
    {
      selector: tourSelectorPrefix + 'collection-box-in-home',
      content: () => {
        return (
          <>
            <span>Each box reperesents a hosted collection in TIB terminology service</span>
            <br /><br />
            <span>Click on the logo to check the list of ontologies in each collection.</span>
            <br /><br />
            <span>Click on the [Read More] to check more details about the collection.</span>
          </>
        )
      }
    },
    {
      selector: tourSelectorPrefix + 'login-in-header',
      content: () => {
        if (appContext.user) {
          return (
            <>
              <span>Your user panel. You can check:</span>
              <li>Profile info</li>
              <li>Define and check your custom ontology collections</li>
              <li>Your submited issue requests for ontologies.</li>
            </>
          );
        }
        return (
          <>
            <span>
              Although ontology lookup is completely free to access, there are some extra functionalities such as note
              feature and term request that require authentication. This it not mondatory for most core functions in terminology service.
            </span>
            <br />
            <span>In case you wish to use the extra features, you can login via:</span>
            <li>GitHub</li>
            <li>Orcid</li>
          </>
        )
      }
    },
  ]

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
        steps={steps}
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