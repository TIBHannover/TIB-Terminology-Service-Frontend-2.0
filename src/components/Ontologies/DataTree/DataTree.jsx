import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import NodePage from '../NodePage/NodePage';
import { withRouter } from 'react-router-dom';
import { MatomoWrapper } from '../../Matomo/MatomoWrapper';
import {jumpToButton} from './helpers';
import Tree from './Tree';



class DataTree extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      selectedNodeIri: '',
      showNodeDetailPage: false,
      componentIdentity: "",
      termTree: false,
      propertyTree: false,
      ontologyId: '',      
      isSkos: false,
      enteredTerm: "",
      result: false,
      api_base_url: "https://service.tib.eu/ts4tib/api",
      jumpResult: []
    })

    this.handleChange = this.handleChange.bind(this);
    this.submitJumpHandler = this.submitJumpHandler.bind(this);
    this.createJumpResultList = this.createJumpResultList.bind(this);
    this.autoRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


/**
 * 'Jump to' feature in the class tree
 */
async handleChange(enteredTerm){
  enteredTerm = enteredTerm.target.value;        
        if (enteredTerm.length > 0){
          let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&ontology=${this.state.ontologyId}&type=class&rows=10`)
          jumpResult = (await jumpResult.json())['response']['docs'];
          this.setState({
              jumpResult: jumpResult,
              result: true,
              enteredTerm: enteredTerm
          });
        }
        else if (enteredTerm.length == 0){
            this.setState({
                result: false,
                enteredTerm: ""
            });
            
        }
}

handleClickOutside(){
  document.addEventListener("click", (event) =>{
    if(this.autoRef.current){
      if(!this.autoRef.current.contains(event.target))
      this.setState({
        result: false
      });
    }    
  })       
}

submitJumpHandler(){
  for(let i=0; i < this.state.jumpResult.length; i++){
  window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.state.jumpResult[i]['ontology_name'] + '/terms?iri=' + this.state.jumpResult[i]['iri']);
  }
}

createJumpResultList(){
  const jumpResultList = []
  for(let i=0; i < this.state.jumpResult.length; i++){
    jumpResultList.push(
      <div className="jump-tree-container">
         {jumpToButton(this.state.jumpResult[i])}
      </div>          
    )
  }
  return jumpResultList
}



componentDidMount(){
  document.addEventListener('click', this.handleClickOutside, true);
}

componentWillUnmount() {
  document.removeEventListener('click', this.handleClickOutside, true);
};


render(){
  return(    
     <div className="row tree-view-container"> 
        <div className="col-sm-6 tree-container-left-part">
        <div className='row jumpto-container'>
          <div className='col-sm-12'>
              <div class="input-group form-fixer">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                      Jump to:
                  </div>
                </div>
                <input class="form-control col-sm-8 rounded-right ac_input" type="text" name="jmp-search-box" aria-label="Jump to:" onChange={this.handleChange} ></input>
              </div> 
            {this.state.result && 
              <div ref={this.autoRef} id = "jmp-tree-container" className="col-md-12 justify-content-md-center">
                {this.createJumpResultList()}       
              </div>} 
          </div>
        </div>
        <div className='row'>
              <Tree
                rootNodes={this.props.rootNodes}
                componentIdentity={this.props.componentIdentity}
                iri={this.props.iri}
                key={this.props.key}                    
                ontology={this.props.ontology}
                rootNodeNotExist={this.props.rootNodeNotExist}
                iriChangerFunction={this.props.iriChangerFunction}
                lastState={this.props.lastState}
                domStateKeeper={this.props.domStateKeeper}
                isSkos={this.props.isSkos}
              ></Tree>
        </div>                 
        
        </div>
        {this.state.termTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
            <MatomoWrapper>
            <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="term"
              extractKey="terms"
              isSkos={this.state.isSkos}
            />
            </MatomoWrapper>
        </div>
        }
        {this.state.propertyTree && this.state.showNodeDetailPage && 
          <div className="col-sm-6 node-table-container">
          <MatomoWrapper>
          <NodePage
              iri={this.state.selectedNodeIri}
              ontology={this.state.ontologyId}
              componentIdentity="property"
              extractKey="properties"
          />
          </MatomoWrapper>
        </div>
        }
    </div>  
  )
}

}

export default withRouter(DataTree);



