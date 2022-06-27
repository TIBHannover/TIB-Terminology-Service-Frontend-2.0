import React from 'react'
import queryString from 'query-string';
import Button from '@mui/material/Button';

class ExactResult extends React.Component{
    constructor(props){
        super(props)
        this.state= ({
            enteredTerm: "",
            result: false
        })
        this.Exact = this.Exact.bind(this);
    }

    async Exact(){
        if(this.state.enteredTerm.length > 0){
            let exactSearchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${this.state.enteredTerm}&exact=on`)
            let resultJson = (await exactSearchResult.json());
            exactSearchResult = resultJson['response']['docs'];
            this.setState({
                exactSearchResult: exactSearchResult,
                result: true 
            })
        }
    }

    render(){
        return(
            <div className="exact-button">
               <Button variant="outlined">Exact Match</Button>
            </div>
        )
    }
}

export default ExactResult;