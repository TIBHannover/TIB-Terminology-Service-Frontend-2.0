import React from "react";
import {keyboardNavigationForJumpto} from './KeyboardNavigation';
import { apiHeaders } from "../../../api/headers";


const TYPE_MAPPER  = {"terms": "class", "props": "property", "individuals": "individual"};



class JumpTo extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            enteredTerm: "",
            result: false,
            api_base_url: process.env.REACT_APP_SEARCH_URL.split('search')[0] + "select",
            jumpResult: []
        });

        this.handleChange = this.handleChange.bind(this);        
        this.createJumpResultList = this.createJumpResultList.bind(this);
        this.autoRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.jumpToButton = this.jumpToButton.bind(this);
    }

    /**
     * 'Jump to' feature in the class tree
     */
    async handleChange(enteredTerm){
        enteredTerm = enteredTerm.target.value; 
        let type = TYPE_MAPPER[this.props.componentIdentity];
        if(type !== "property" && type !== "individual"){
            type = this.props.isSkos ? "individual" : "class"; 
        }       
        if (enteredTerm.length > 0){
            let url = `${this.state.api_base_url}?q=${enteredTerm}&ontology=${this.props.ontologyId}&type=${type}&rows=10`;
            let jumpResult = await fetch(url,{
                mode: 'cors',
                headers: apiHeaders(),
            })
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
    
    
    createJumpResultList(){
        let jumpResultList = []
        for(let i=0; i < this.state.jumpResult.length; i++){
        jumpResultList.push(
            <div className="jumpto-item-holder jumpto-autosuggest-item">
                {this.jumpToButton(this.state.jumpResult[i])}
            </div>          
        )
        }
        return jumpResultList
    }

    /**
     * function for generating jump to results
     */
    jumpToButton(resultItem){
        let content = [];
        let targetHref = "";        
        if(this.props.componentIdentity === "termList"){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/termList?iri=' + encodeURIComponent(resultItem['iri']);
        } 
        else if(resultItem["type"] === 'class' || this.props.componentIdentity === "terms"){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
        }
        else if(resultItem["type"] === 'property'){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/props?iri=' + encodeURIComponent(resultItem['iri']);       
        }
        else if(resultItem["type"] === 'individual'){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/individuals?iri=' + encodeURIComponent(resultItem['iri']);       
        }         
        content.push(
            <a href={targetHref} className="jumto-result-link container">
                <div className="jumpto-result-text item-for-navigation">
                    {resultItem['label']}
                </div>
            </a>
        ); 
        
        return content; 
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClickOutside, true);
        document.addEventListener("keydown", keyboardNavigationForJumpto, false);
    }
      
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
        document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
    };


    render(){
        return(
            <div className='row jumpto-wrapper'>
                <div className={this.props.containerBootstrapClass ? this.props.containerBootstrapClass : 'col-sm-8'}>
                    <div class="input-group">                        
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                Jump to:
                            </div>
                        </div>
                        <input class="form-control jumpto-search-box col-sm-6 rounded-right ac_input" type="text" name="jmp-search-box" aria-label="Jump to:" onChange={this.handleChange} ></input>
                    </div> 
                    {this.state.result && 
                    <div ref={this.autoRef}  className="col-md-12 justify-content-md-center jumpto-container jumpto-tree-container" id="jmp-tree-container">
                        {this.createJumpResultList()}       
                    </div>} 
                </div>                
            </div>
        );
    }
}

export default JumpTo;