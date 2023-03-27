import React from 'react';
import queryString from 'query-string';
import {setJumpResultButtons} from './SearchFormHelpers';

class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          clickInfo: false,
          searchResult: [],
          jumpResult: [],
          entry: [],
          ontologyId: '',
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
      }


      async handleChange(enteredTerm){
        enteredTerm = enteredTerm.target.value;        
        if (enteredTerm.length > 0){
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
        else if (enteredTerm.length == 0){
            this.setState({
                result: false,
                enteredTerm: ""
            });
            
        }
      }


    submitHandler(){ 
        let urlPath = window.location.pathname
        let ontologyId = urlPath.split('/'); 
        ontologyId = ontologyId[3];                      
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
        else if(enteredTerm !== "" && urlPath.includes("/ontologies/" + ontologyId)){
          let url = new URL(window.location);    
          url.searchParams.delete('q');
          url.searchParams.delete('page');
          url.searchParams.append('q', enteredTerm);
          url.searchParams.append('ontology', ontologyId)
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

    updateURL(ontologies){
      let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
      this.props.history.push(window.location.pathname);
      let currentUrlParams = new URLSearchParams();   
      for(let ontos of ontologies){
        currentUrlParams.append('ontology', ontos);
      }
      this.props.history.push(window.location.pathname + "?q=" + this.state.enteredTerm + "&" + currentUrlParams.toString());
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
      }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
      };

      createResultList(){
          const resultList = []          
          for(let i=0; i < this.state.searchResult.length; i++){
            resultList.push(
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + encodeURIComponent(this.state.searchResult[i]['autosuggest'])} key={i} className="container">   
                    <div className="autocomplete-item">                  
                          {this.state.searchResult[i]['autosuggest']}
                    </div>
                  </a>
                
                )
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
        let urlPath = window.location.pathname
        let ontologyId = urlPath.split('/'); 
        ontologyId = ontologyId[3];            
        urlPath = urlPath.includes("/ontologies/" + ontologyId)
        let showBox = [];
          showBox.push(
            <div class="input-group-prepend">
              <div class="input-group-text">       
              <div className="search-in-box">
                Search:               
                  {ontologyId}                                                                                                                        
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
        let urlPath = window.location.pathname
        let ontologyId = urlPath.split('/'); 
        ontologyId = ontologyId[3];            
        urlPath = urlPath.includes("/ontologies/" + ontologyId)             
          return(
              <div className='col-sm-10'>
                <div class="input-group input-group-lg">
                  {urlPath && this.urlOnto()}                              
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
                {this.state.result &&
                <div ref={this.autoRef} id = "jumpresult-container" className="col-md-12 justify-content-md-center">
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