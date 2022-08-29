import React from "react";
import "../layout/Home.css"
import {createStatsBox} from './StatsBox';
import {createHomePageContent} from './CollectionsCards';

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state=({
       statsResult: []
    })
    this.Stats = this.Stats.bind(this);
    this.readMoreClickHandler = this.readMoreClickHandler.bind(this);
  }

  async Stats(){
    let statsResult = await fetch(`https://service.tib.eu/ts4tib/api/ontologies/getstatistics`)
    statsResult = (await statsResult.json());
    this.setState({
      statsResult: statsResult
    })

  }

  /**
   * Show more text for the collections card on the home page
   * @param {*} e 
   */
  readMoreClickHandler(e){
    for(let node of e.target.parentNode.children){
      if(node.nodeName === "P" && node.classList.contains("trunc")){
        node.classList.remove("trunc");
        e.target.innerHTML = "[Show Less]";
      }
      else if(node.nodeName === "P" && !node.classList.contains("trunc")){
        node.classList.add("trunc");
        e.target.innerHTML = "[Show More]"
      }
    }
  }



  componentDidMount(){
    this.Stats();
  }
    render(){
        return(
        <div id="mainpageSearchBox">
            {createHomePageContent(this.readMoreClickHandler)}
          <div className="container home-page-stats-container">
              {createStatsBox(this.state.statsResult)}
          </div>
        </div>
        );
    }
}
export default Home;