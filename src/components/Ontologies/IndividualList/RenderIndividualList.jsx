
export const RenderIndividualList = (props) => {

  
  
    function createIndividualList(){
        let result = [];
        let individuals = props.individuals;
        for (let indv of individuals){
            result.push(
                <li className="list-node-li">
                    <span className="tree-text-container" data-iri={indv["iri"]} id={indv["iri"]}>
                        {indv["label"] !== "" ? indv["label"] : "N/A"}
                    </span>
                </li>
            );
        }
        if (result.length === 0 && props.isLoaded){
            result.push(
                <div className="alert alert-success">
                    This ontology has no individual.
                </div>
            );
        }
        return result;
    }



    function createActionButtonSection(){
        return [
            typeof(props.iri) !== "undefined" && props.iri !== " "  && props.individuals.length !== 0 &&
                <div className="row tree-action-button-holder">                    
                    <div className="col-sm-12">
                        <button className='btn btn-secondary btn-sm tree-action-btn' onClick={props.switchViewFunction}>
                            {props.listView ? "Show In Tree" : ""}
                        </button>                                
                    </div>                    
                </div>                    
                
        ];
    }


    return (
        <>
            <div className='row tree-action-button-area'>                        
                <div className="col-sm-12 text-right">
                    {createActionButtonSection()}
                </div>                        
            </div> 
            <div className="col-sm-12">
                {!props.isLoaded && <div className="col-sm-12 isLoading"></div>}                    
                <div className="row">
                    <div className="col-sm-12">
                        <ul>
                            {createIndividualList()}
                        </ul>
                    </div>                    
                </div>
            </div>
        </>
    );

}