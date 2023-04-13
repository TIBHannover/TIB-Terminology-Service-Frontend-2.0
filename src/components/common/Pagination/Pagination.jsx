import React from 'react';

class Pagination extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            activePageNumber: 1,            
            pageCount: 0,
            listOfPageNumbersToRender: [],
            middleButonsHtml: ""
        });              
        this.createMiddleButtons = this.createMiddleButtons.bind(this);
        this.setTheListOfPageNumbersToRender = this.setTheListOfPageNumbersToRender.bind(this);
        this.paginationClickHandler = this.paginationClickHandler.bind(this);
    }


    setTheListOfPageNumbersToRender(){
        let numbersToRender = [];
        let currentPageNumebr = this.state.activePageNumber;
        let totalPageCount = this.state.pageCount;
        if(totalPageCount === 1){
            numbersToRender.push(1);            
        }
        else if(totalPageCount === 2){
            numbersToRender.push(1);
            numbersToRender.push(2);            
        }
        else if(currentPageNumebr < totalPageCount - 1){
            numbersToRender.push(currentPageNumebr);
            numbersToRender.push(currentPageNumebr + 1);
            numbersToRender.push(currentPageNumebr + 2);
        }
        else if(currentPageNumebr + 1 === totalPageCount){
            numbersToRender.push(currentPageNumebr - 1);
            numbersToRender.push(currentPageNumebr);
            numbersToRender.push(currentPageNumebr + 1);
        }
        else if(currentPageNumebr === totalPageCount){
            numbersToRender.push(currentPageNumebr - 2);
            numbersToRender.push(currentPageNumebr - 1);
            numbersToRender.push(currentPageNumebr);            
        }
        this.setState({
            listOfPageNumbersToRender: numbersToRender
        }, () =>{
            this.createMiddleButtons();
        });
    }


    createMiddleButtons(){        
        let result = [];
        let numbersToRender = this.state.listOfPageNumbersToRender;
        let activeNumber = this.state.activePageNumber;
        for(let number of numbersToRender){
            result.push(
                <li className={'pagination-btn pagination-middle-btn ' + (activeNumber === number ? "selected-page" : "")} 
                    onClick={this.paginationClickHandler}
                    value={number}>
                    <a className='pagination-link'>{number}</a>
                </li>
            );
        }
        this.setState({middleButonsHtml: result});
    }


    paginationClickHandler(e){
        let activePageNumber = this.state.activePageNumber;        
        if(e.target.classList.contains('pagination-end')){
            activePageNumber = this.nextButtonClickedValue();            
        }
        else if(e.target.classList.contains('pagination-start')){
            activePageNumber = this.previousButtonClickedValue();
        }
        else{
            activePageNumber = this.middleButtonClickedValue(e.target);
        }
        this.setState({
            activePageNumber: parseInt(activePageNumber)
        }, ()=> {
            this.setTheListOfPageNumbersToRender();
            this.props.clickHandler(activePageNumber);
        }); 
    }

    previousButtonClickedValue(){
        let activePageNumber = parseInt(this.state.activePageNumber);
        if (activePageNumber > 1){
            return activePageNumber - 1;                    
        }
        return activePageNumber;
    }


    nextButtonClickedValue(){
        let activePageNumber = parseInt(this.state.activePageNumber);
        if (activePageNumber < parseInt(this.props.count)){
            return activePageNumber + 1;                    
        }
        return activePageNumber;
    }


    middleButtonClickedValue(element){        
        if (element.nodeName === "LI"){
            return element.value;
        }
        return element.parentNode.value;              
    }


    componentDidMount(){
        this.setState({
            activePageNumber: this.props.initialPageNumber,
            pageCount: this.props.count
        }, () => {
            this.setTheListOfPageNumbersToRender();
        });
    }

    componentDidUpdate(){        
        let inCommingPageCount = parseInt(this.props.count);
        let currentPageCount = parseInt(this.state.pageCount);
        let inCommingPageNumber = parseInt(this.props.initialPageNumber);
        let currentPageNumber = parseInt(this.state.activePageNumber);
        if(inCommingPageCount !==  currentPageCount || inCommingPageNumber !== currentPageNumber){
            this.setState({                
                pageCount: parseInt(this.props.count),
                activePageNumber: parseInt(this.props.initialPageNumber)
            }, () => {this.setTheListOfPageNumbersToRender()});
        }
    }


    render(){
        return (
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start' onClick={this.paginationClickHandler}>
                   <a className='pagination-link pagination-start'>Previous</a>
                </li>               
                {this.state.middleButonsHtml}
                <li className='pagination-btn pagination-end' onClick={this.paginationClickHandler}>
                    <a className='pagination-link pagination-end'>Next</a>
                </li>
            </ul>
        );
    }

}

export default Pagination;