import React from "react";
import '../layout/home.css';
import {createStatsBox} from './StatsBox';
import { renderHomePage } from "./HomePageContent";
import { getCallSetting } from "../../api/constants";

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);    
  }

  async Stats(){
    let statsResult = await fetch(process.env.REACT_APP_STATS_API_URL, getCallSetting)
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
          {renderHomePage()}
          <div className="row justify-content-center home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>        
      </div>
      );
  }
}
export default Home;