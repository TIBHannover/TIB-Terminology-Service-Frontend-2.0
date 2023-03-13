import React from "react";


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
        this.submitJumpHandler = this.submitJumpHandler.bind(this);
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
        let type = this.props.componentIdentity;
        if(type !== "property" && type !== "individual"){
            type = this.props.isSkos ? "individual" : "class"; 
        }       
            if (enteredTerm.length > 0){
                let url = `${this.state.api_base_url}?q=${enteredTerm}&ontology=${this.props.ontologyId}&type=${type}&rows=10`;
                let jumpResult = await fetch(url)
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
        let jumpResultList = []
        for(let i=0; i < this.state.jumpResult.length; i++){
        jumpResultList.push(
            <div className="jump-tree-container">
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
        if(resultItem["type"] === 'class' || this.props.componentIdentity === "term"){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/terms?iri=' + encodeURIComponent(resultItem['iri']);       
        }
        else if(resultItem["type"] === 'property'){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/props?iri=' + encodeURIComponent(resultItem['iri']);       
        }
        else if(resultItem["type"] === 'individual'){
            targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(resultItem['ontology_name']) + '/individuals?iri=' + encodeURIComponent(resultItem['iri']);       
        }    
        content.push(
            <a href={targetHref} className="container">
            <div className="jump-tree-item">         
                {resultItem['label']}
            </div>
            </a>
        ); 
        
        return content; 
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClickOutside, true);        
    }
      
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    };


    render(){
        return(
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
        );
    }
}

export default JumpTo;