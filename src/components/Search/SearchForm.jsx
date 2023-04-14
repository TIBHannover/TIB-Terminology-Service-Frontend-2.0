import React from 'react';
import queryString from 'query-string';
import {setJumpResultButtons} from './SearchFormHelpers';
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
          insideOnto: false,
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
        this.allRef =  React.createRef();
        this.ontoRef =  React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.urlOnto = this.urlOnto.bind(this);
        this.setComponentData = this.setComponentData.bind(this);
      }

      setComponentData(){
        //let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
        let urlPath = window.location.pathname
        let ontologyId = urlPath.split('/'); 
        ontologyId = ontologyId[3]            
        urlPath = urlPath.includes("/ontologies/" + ontologyId)
        this.setState({
          ontologyId: ontologyId,
          urlPath: urlPath
        })
      }


      async handleChange(enteredTerm){
        enteredTerm = enteredTerm.target.value                
        if (enteredTerm.length > 0 && !this.state.urlPath){
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

      handleAllClick(){
        document.addEventListener("click", (event) => {
          if(this.allRef.current){
            if(this.allRef.current.contains(event.target))
            this.setState({
              insideOnto: false
            })
          }
        } )
      }

      handleOntoClick(){
        document.addEventListener("click", (event) => {
          if(this.ontoRef.current){
            if(this.ontoRef.current.contains(event.target))
            this.setState({
              insideOnto: true
            })
          }
        } )
      }
    
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
        document.addEventListener('click', this.handleAllClick, true);
        document.addEventListener('click', this.handleOntoClick, true);
        this.setComponentData();         
        document.addEventListener("keydown", keyboardNavigationForJumpto, false);       
    }
    
   
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
        document.removeEventListener('click', this.handleAllClick, true);
        document.removeEventListener('click', this.handleOntoClick, true);
        document.removeEventListener("keydown", keyboardNavigationForJumpto, false);
     };


      createResultList(){
          const resultList = []          
          for(let i=0; i < this.state.searchResult.length; i++){
            if(this.state.urlPath){
              resultList.push(
                <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest']) + `&ontology=${(this.state.ontologyId).toUpperCase()}`} key={i} className="container">   
                  <div className="autocomplete-item">                  
                        {this.state.searchResult[i]['autosuggest']}
                  </div>
                </a>
              
              )
            }
            else {
              resultList.push(
                <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">   
                  <div className="autocomplete-item">                  
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
            <div className="jumpto-item-holder">
               {setJumpResultButtons(this.state.jumpResult[i])}
            </div>          
          )
        }
        return jumpResultList
      }

      urlOnto(){
        let showBox = [];
          showBox.push(
            <div class="input-group-prepend">
              <div class="input-group-text">       
              <div className="search-in-box">
                Search:                
                <a ref={this.ontoRef} className="search-form-nav search-form-nav-clicked" href={""}>               
                    {"\n" + (this.state.ontologyId).toUpperCase() + "\n"}
                  </a>
                <a ref={this.allRef} href={""}>  
                All
                </a>                                                                                                                          
              </div>
              </div> 
            </div>                 
          )
          return showBox;          
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
                  {this.state.urlPath && this.urlOnto()}                              
                  <input 
                    type="text" 
                    class="form-control search-input" 
                    placeholder="Search for ontology, term, properties" 
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
                {this.state.result &&
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