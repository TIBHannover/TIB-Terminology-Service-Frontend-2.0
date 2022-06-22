import React from 'react'
import queryString from 'query-string';

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
        let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
        let enteredTerm = targetQueryParams.q
        if(enteredTerm.length > 0){
            let exactSearchResult = await fetch(`https://service.tib.eu/ts4tib/api/search?q=${enteredTerm}&exact=on`)
            let resultJson = (await exactSearchResult.json());
            exactSearchResult = resultJson['response']['docs'];
            this.setState({
                exactSearchResult: exactSearchResult,
                result: true 
            })
        }
    }
}

export default ExactResult;