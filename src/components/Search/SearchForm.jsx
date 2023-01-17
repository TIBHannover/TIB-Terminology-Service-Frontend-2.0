import React from 'react';

class SearchForm extends React.Component{
    constructor (props) {
        super(props)
        this.state = ({
          enteredTerm: "",
          result: false,
          clickInfo: false,
          searchResult: [],
          jumpResult: [],
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


    submitHandler(event){  
        let enteredTerm = document.getElementById('s-field').value;
        if(enteredTerm !== ""){
          window.location.replace(process.env.REACT_APP_PROJECT_SUB_PATH + '/search?q=' + enteredTerm);
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
          if(!this.autoRef.current.contains(event.target))
          this.setState({
            result: false
          })
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
            {(() => {
              if(this.state.jumpResult[i]["type"] === 'class'){
                return(
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH +'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">   
                    <div className="jump-autocomplete-item">         
                     {this.state.jumpResult[i]['label']}
                     <div className="btn btn-default jmp-term-button">{this.state.jumpResult[i]['short_form']}</div>
                     <div className="btn btn-default jmp-ontology-button">{this.state.jumpResult[i]['ontology_prefix']}</div>  
                     </div>                
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'property'){
                return(
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH +'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/props?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">  
                  <div className="jump-autocomplete-item">          
                     {this.state.jumpResult[i]['label']}
                     <div className="btn btn-default jmp-term-button">{this.state.jumpResult[i]['short_form']}</div>
                     <div className="btn btn-default jmp-ontology-button">{this.state.jumpResult[i]['ontology_prefix']}</div> 
                  </div>                
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'individual'){
                return(
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH +'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name']) +'/terms?iri=' + encodeURIComponent(this.state.jumpResult[i]['iri'])} key={i} className="container">   
                  <div className="jump-autocomplete-item">        
                     {this.state.jumpResult[i]['label']}
                     <div className="btn btn-default jmp-term-button">{this.state.jumpResult[i]['short_form']}</div>
                     <div className="btn btn-default jmp-ontology-button">{this.state.jumpResult[i]['ontology_prefix']}</div>
                  </div>                   
                  </a>
                )
              }
              if(this.state.jumpResult[i]["type"] === 'ontology'){
                return(
                  <a href={process.env.REACT_APP_PROJECT_SUB_PATH +'/ontologies/' + encodeURIComponent(this.state.jumpResult[i]['ontology_name'])} key={i} className="container"> 
                  <div className="jump-autocomplete-item">          
                     {this.state.jumpResult[i]['label']}
                     <div className="btn btn-default jmp-term-button">{this.state.jumpResult[i]['short_form']}</div>
                     <div className="btn btn-default jmp-ontology-button">{this.state.jumpResult[i]['ontology_prefix']}</div> 
                  </div>                  
                  </a>
                )
              }

            })()} 
            </div>          
          )
        }
        return jumpResultList
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