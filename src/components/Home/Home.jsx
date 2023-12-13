import React from "react";
import '../layout/home.css';
import {createStatsBox} from './StatsBox';
import {createHomePageContent} from './CollectionsCards';
import {nfdi4chemHomePage} from './Nfdi4chem_home';
import {nfdi4ingHomePage} from './Nfdi4ing_home';
import {apiHeaders} from '../../api/headers';

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);    
  }

  async Stats(){
    let statsResult = await fetch(process.env.REACT_APP_STATS_API_URL, {
      method: 'GET',
      mode: 'cors',
      headers: apiHeaders(),
    })
    statsResult = (await statsResult.json());
    this.setState({
      statsResult: statsResult
    })
  }

 
  componentDidMount(){
    this.Stats();
  }

  render(){
      return(
      <div className="row">
        <div className="col-sm-12">
          {/* {process.env.REACT_APP_PROJECT_ID === "general" && createHomePageContent()}
          {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemHomePage()}
          {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4ingHomePage()} */}
          {nfdi4chemHomePage()}
          <div className="row justify-content-center home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>        
      </div>
      );
  }
}
export default Home;