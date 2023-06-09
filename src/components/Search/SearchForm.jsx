import React from 'react';
import {setJumpResultButtons ,ontologyForAutosuggest} from './SearchFormHelpers';
import {keyboardNavigationForJumpto} from '../Ontologies/JumpTo/KeyboardNavigation';


class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          clickInfo: false,
          searchResult: [],
          ontoSearchResult: [],
          jumpResult: [],
          entry: [],
          ontologyId: '',
          urlPath: '',
          facetIsSelected: false,
          api_base_url: "https://service.tib.eu/ts4tib/api"
        })
        this.handleChange = this.handleChange.bind(this);
        this.createResultList = this.createResultList.bind(this);
        this.createJumpResultList = this.createJumpResultList.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.submitJumpHandler = this.submitJumpHandler.bind(this);  
        this.suggestionHandler = this.suggestionHandler.bind(this); 
        this.autoRef = React.createRef(); 
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.urlOnto = this.urlOnto.bind(this);
        this.setComponentData = this.setComponentData.bind(this);
      }

      setComponentData(){
        let urlPath = window.location.pathname
        let ontologyId = urlPath.split('/'); 
        ontologyId = ontologyId[3]            
        urlPath = urlPath.includes("/ontologies/" + ontologyId)
        this.setState({
          ontologyId: ontologyId,
          urlPath: urlPath,
        })
      }


      async handleChange(enteredTerm){
        enteredTerm = enteredTerm.target.value               
        if (enteredTerm.length > 0 && !this.state.urlPath){ 
          let params = new URLSearchParams(document.location.search);
          let selectedType = params.getAll("type");
          selectedType = selectedType.map(onto => onto.toLowerCase());       
          let selectedOntology = params.getAll("ontology")         
          selectedOntology = selectedOntology.map(onto => onto.toLowerCase());
          let selectedCollection = params.getAll("collection")            
          if(process.env.REACT_APP_PROJECT_ID === "general"){
            if(selectedOntology){
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              searchResult =  (await searchResult.json())['response']['docs'];
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              jumpResult = (await jumpResult.json())['response']['docs'];
              this.setState({
                searchResult: searchResult,
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }
            else if(selectedType || selectedOntology){
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&rows=5&type=${selectedType}&ontology=${selectedOntology}`)
              jumpResult = (await jumpResult.json())['response']['docs']
              console.info(jumpResult)
              this.setState({
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }
            else if(selectedCollection === "NFDI4CHEM"){
              let ontologies = [];
            let ontologiesForCollection = await fetch(`${this.state.api_base_url}/ontologies/filterby?schema=collection&classification=NFDI4CHEM&exclusive=false`)
            ontologiesForCollection = (await ontologiesForCollection.json())['_embedded']['ontologies']
            for(let onto of ontologiesForCollection){
              ontologies.push(onto['ontologyId']);
            }
            let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
            searchResult =  (await searchResult.json())['response']['docs'];
            let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
            jumpResult = (await jumpResult.json())['response']['docs'];
            console.info(jumpResult)
            this.setState({
              searchResult: searchResult,
              jumpResult: jumpResult,
              result: true,
              enteredTerm: enteredTerm
            });
            }
            else {
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&rows=5`)
            searchResult =  (await searchResult.json())['response']['docs'];
            let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&rows=5`)
            jumpResult = (await jumpResult.json())['response']['docs'];
            this.setState({
              searchResult: searchResult,
              jumpResult: jumpResult,
              result: true,
              enteredTerm: enteredTerm
            });

            }           
          }
          else if(process.env.REACT_APP_PROJECT_ID === "nfdi4chem"){
            let ontologies = [];
            let ontologiesForCollection = await fetch(`${this.state.api_base_url}/ontologies/filterby?schema=collection&classification=NFDI4CHEM&exclusive=false`)
            ontologiesForCollection = (await ontologiesForCollection.json())['_embedded']['ontologies']
            for(let onto of ontologiesForCollection){
              ontologies.push(onto['ontologyId']);
            }
            if(selectedOntology){
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              searchResult =  (await searchResult.json())['response']['docs'];
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              jumpResult = (await jumpResult.json())['response']['docs'];
              this.setState({
                searchResult: searchResult,
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }
            else {
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
              searchResult =  (await searchResult.json())['response']['docs'];
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
              jumpResult = (await jumpResult.json())['response']['docs'];
              this.setState({
                searchResult: searchResult,
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }            
          }
          else if(process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
            let ontologies = [];
            let ontologiesForCollection = await fetch(`${this.state.api_base_url}/ontologies/filterby?schema=collection&classification=NFDI4ING&exclusive=false`)
            ontologiesForCollection = (await ontologiesForCollection.json())['_embedded']['ontologies']
            for(let onto of ontologiesForCollection){
              ontologies.push(onto['ontologyId']);
            }
            if(selectedOntology){
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              searchResult =  (await searchResult.json())['response']['docs'];
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&rows=5&ontology=${selectedOntology}`)
              jumpResult = (await jumpResult.json())['response']['docs'];
              this.setState({
                searchResult: searchResult,
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }
            else{
              let searchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
              searchResult =  (await searchResult.json())['response']['docs'];
              let jumpResult = await fetch(`${this.state.api_base_url}/select?q=${enteredTerm}&ontology=${ontologies}&rows=5`)
              jumpResult = (await jumpResult.json())['response']['docs'];
              this.setState({
                searchResult: searchResult,
                jumpResult: jumpResult,
                result: true,
                enteredTerm: enteredTerm
              });
            }           
          }
        }
        else if(enteredTerm.length > 0 && this.state.urlPath){
          let ontoSearchResult = await fetch(`${this.state.api_base_url}/suggest?q=${enteredTerm}&rows=5&ontology=${this.state.ontologyId}`)
          ontoSearchResult = (await ontoSearchResult.json())['response']['docs'];
          this.setState({
            searchResult: ontoSearchResult,
            result: true 
          });
        }
        else if (enteredTerm.length == 0){
            this.setState({
                result: false,
                enteredTerm: ""
            });          
        }
      }


    submitHandler(){                      
        let enteredTerm = document.getElementById('s-field').value;        
        if(enteredTerm !== ""){
          let url = new URL(window.location);    
          url.searchParams.delete('q');
          url.searchParams.delete('page');
          url.searchParams.append('q', enteredTerm);
          url.searchParams.append('page', 1);
          url.pathname = "/ts/search";
          window.location.replace(url);
        }
        if(enteredTerm !== "" && this.state.ontologyId){
          let url = new URL(window.location);    
          url.searchParams.delete('q');
          url.searchParams.delete('page');
          url.searchParams.append('q', enteredTerm);
          url.searchParams.append('ontology', (this.state.ontologyId).toUpperCase());
          url.searchParams.append('page', 1);
          url.pathname = "/ts/search";
          window.location.replace(url);
        }
    }

    submitJumpHandler(e){
      for(let i=0; i < this.state.jumpResult.length; i++){
      window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + this.state.jumpResult[i]['ontology_name'] + '/terms?iri=' + this.state.jumpResult[i]['iri']);
      }
    }
    
    
    async suggestionHandler(selectedTerm){
        let selection = await fetch(`${this.state.api_base_url}/search?q=${selectedTerm}`)
        selection =  (await selection.json())['response']['docs'];
        this.setState({
            selection: selection,
            result: true
          });
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
    
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
        this.setComponentData();         
        document.addEventListener("keydown", keyboardNavigationForJumpto, false);       
    }
    
   
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
        document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
     };


      createResultList(){
          const resultList = [];
          for(let i=0; i < this.state.searchResult.length; i++){
            if(this.state.urlPath){
              resultList.push(
                <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest']) + `&ontology=${(this.state.ontologyId).toUpperCase()}`} key={i} className="container">   
                  <div className="autocomplete-item item-for-navigation">
                        {this.state.searchResult[i]['autosuggest']}
                  </div>
                </a>     
              
              )
            }
            else {
              resultList.push(
                <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">   
                  <div className="autocomplete-item item-for-navigation">
                        {this.state.searchResult[i]['autosuggest']}
                  </div>
                </a>    
              )
            }    
          }
          return resultList
      }

      createJumpResultList(){
        const jumpResultList = []
        for(let i=0; i < this.state.jumpResult.length; i++){
          jumpResultList.push(
            <div className="jump-autocomplete-container">
               {setJumpResultButtons(this.state.jumpResult[i])}
            </div>          
          )
        }
        return jumpResultList
      }

      urlOnto(){
        let placeholder= "";
           if(this.state.ontologyId && this.state.urlPath){
             placeholder = "Search in \n" + this.state.ontologyId;
           }
           else {
            placeholder = "Search for ontology, term, properties and individuals"
           }
           return placeholder;       
        }
        


      _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.submitHandler();
        }
      }

      render(){                    
          return(
              <div className='col-sm-10'>
                <div class="input-group input-group-lg">                              
                  <input 
                    type="text" 
                    class="form-control search-input" 
                    placeholder={this.urlOnto()}
                    aria-describedby="basic-addon2"
                    onChange={this.handleChange}
                    onKeyDown={this._handleKeyDown}
                    id="s-field"                    
                    ></input>
                  <div class="input-group-append">
                    <button className='btn btn-outline-secondary search-btn' type='button' onClick={this.submitHandler}>Search </button>  
                  </div>
                </div>
                                      
                {this.state.result &&
                <div ref={this.autoRef} id = "autocomplete-container" className="col-md-12">{this.createResultList()}</div>}
                {this.state.result && !this.state.urlPath &&
                <div ref={this.autoRef} id = "jumpresult-container" className="col-md-12 justify-content-md-center"></div>}
                {this.state.result && !this.state.urlPath &&
                <div ref={this.autoRef} className="col-md-12 justify-content-md-center jumpto-container jumpto-search-container" id="jumpresult-container" >
                  <div>
                    <h4>Jump To</h4>
                    {this.createJumpResultList()}
                  </div>
                </div>}
                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <p>
                 <span class="examples" >Examples: <a class="example-link" href="search?q=electric+vehicle">electric vehicle</a>,
                 <a class="example-link" href="search?q=agent">agent</a></span>
               </p>
                }
              </div>
          )
      }

}

export default SearchForm;