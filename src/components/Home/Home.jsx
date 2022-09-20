import React from "react";
import {createStatsBox} from './StatsBox';
import {createHomePageContent} from './CollectionsCards';

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);    
  }

  async Stats(){
    let statsResult = await fetch(process.env.REACT_APP_STATS_API_URL)
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
        <div>
          {process.env.REACT_APP_PROJECT_ID === "general" && createHomePageContent()}
          <div className="container home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>
        );
    }
}
export default Home;