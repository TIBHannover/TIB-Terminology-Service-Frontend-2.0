import React from "react";
import "../layout/Home.css"
import {createStatsBox} from './StatsBox';
import {createCollectionCards} from './CollectionsCards';

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);
  }

  async Stats(){
    let statsResult = await fetch(`https://service.tib.eu/ts4tib/api/ontologies/getstatistics`)
    statsResult = (await statsResult.json());
    console.info(statsResult)
    this.setState({
      statsResult: statsResult
    })

  }

  componentDidMount(){
    this.Stats();
  }
    render(){
        return(
        <div id="mainpageSearchBox">          
          {createCollectionCards()}
          <div className="container home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>
        );
    }
}
export default Home;