import React from "react";
import {createStatsBox} from './StatsBox';
import {createHomePageContent} from './CollectionsCards';
import {nfdi4chemHomePage} from './Nfdi4chem_home';
import {nfdi4ingHomePage} from './Nfdi4ing_home';

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
      <div className="row">
        <div className="cc_banner-wrapper">
           <div className="cc_banner cc_container cc-container--open">
             <a className="cc_btn cc_btn_accept_all" href="" data-cc-event="click:dismiss" rel="nofollow">Got it</a>
             <p className="cc_message">
               This website only uses technically necessary cookies
               <a className="cc_more_info" data-cc-if="options.link" href="/PrivacyPolicy">More info</a>
             </p>
           </div>
        </div>
        <div className="col-sm-12">
          {process.env.REACT_APP_PROJECT_ID === "general" && createHomePageContent()}
          {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && nfdi4chemHomePage()}
          {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && nfdi4ingHomePage()}
          <div className="row justify-content-center home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>        
      </div>
      );
  }
}
export default Home;