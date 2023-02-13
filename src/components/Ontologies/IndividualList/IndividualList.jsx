import React from "react";


class IndividualsList extends React.Component {
    constructor(props){
        super(props);

    }



    render(){
        return(
            <div className="row tree-view-container" onClick={(e) => this.processClick(e)}> 
                <div className="col-sm-6 tree-container">
                    
                </div>
            </div>
        );        
    }
}

export default IndividualsList;