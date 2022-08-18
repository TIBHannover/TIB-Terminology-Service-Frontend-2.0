import React from 'react';
import "../../layout/Common.css";


class Pagination extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            pageNumber: 1,
            endReached: false,
            pageCount: 0
        });
        this.previousClickHandler = this.previousClickHandler.bind(this);
        this.nextClickHandler = this.nextClickHandler.bind(this);
        this.middleClickHandler = this.middleClickHandler.bind(this);
        this.checkOutOfRange = this.checkOutOfRange.bind(this);
        this.createMiddleButtons = this.createMiddleButtons.bind(this);
    }


    /**
     * Click handler for the Previous button
     */
    previousClickHandler(){
        let pageNumber = parseInt(this.state.pageNumber);
        if (pageNumber > 1){
            this.setState({
                pageNumber: pageNumber - 1
            });
            this.props.clickHandler(pageNumber - 1);
            this.checkOutOfRange(parseInt(pageNumber) - 1);
        }
    }


    /**
     * Click handler for the Next button
     */
    nextClickHandler(){
        let pageNumber = parseInt(this.state.pageNumber);
        if (pageNumber < parseInt(this.props.count)){
            this.setState({
                pageNumber: pageNumber + 1
            });
            this.props.clickHandler(pageNumber + 1);
            this.checkOutOfRange(parseInt(pageNumber) + 1);
        }
    }


    /**
     * Click handler for pagination buttons (except previous and next)
     */
    middleClickHandler(e){        
        let pageNumber = 0;
        if (e.target.nodeName === "LI"){
            pageNumber = e.target.value;
        }
        else{            
            pageNumber = e.target.parentNode.value;
        }
        this.setState({
            pageNumber: parseInt(pageNumber)
        });
        this.props.clickHandler(pageNumber);
        this.checkOutOfRange(parseInt(pageNumber));
    }


    /**
     * Check the page is out of range or not. If yes, it hides the out of range ones and show the last-two buttons.
     */
    checkOutOfRange(pageNumber){                       
        if (!this.state.endReached && parseInt(pageNumber) === parseInt(this.props.count) && parseInt(pageNumber) > 2){
            // Page Number is out of range
            let toSHowButtons = document.querySelectorAll(".out-of-range-hidden-page-btn");            
            for(let i=0; i<toSHowButtons.length; i++){
                toSHowButtons[i].classList.remove("out-of-range-hidden-page-btn");                 
            }
            let toHideButtons = document.querySelectorAll(".in-range-btn");
            for(let i=0; i<toHideButtons.length; i++){                
                toHideButtons[i].classList.add("out-of-range-hidden-page-btn");
            }
            this.setState({endReached:true});
        }
        else if (this.state.endReached){
            // Revert back the changes made above
            let toSHowButtons = document.querySelectorAll(".in-range-btn.out-of-range-hidden-page-btn");
            for(let i=0; i<toSHowButtons.length; i++){
                toSHowButtons[i].classList.remove("out-of-range-hidden-page-btn");             
            }
            let toHideButtons = document.querySelectorAll(".pag-minus-btn");
            for(let i=0; i<toHideButtons.length; i++){                
                toHideButtons[i].classList.add("out-of-range-hidden-page-btn");
            }
            this.setState({endReached:false});
        }
    }


    /**
     * Create the middle buttons for pagination based on the page count
     * @returns 
     */
    createMiddleButtons(){        
        let result = [];
        result.push(
            <li className='pagination-btn pagination-middle-btn selected-page' onClick={this.middleClickHandler} value={this.state.pageNumber}>
                <a className='pagination-link'>{this.state.pageNumber}</a>
            </li>
        );
        if(parseInt(this.props.count) - this.state.pageNumber > 1){            
            result.push(
                <li className='pagination-btn pagination-middle-btn in-range-btn' onClick={this.middleClickHandler} value={this.state.pageNumber + 1}>
                    <a className='pagination-link'>{this.state.pageNumber + 1}</a>
                </li>
            );
            result.push(
                <li className='pagination-btn pagination-middle-btn in-range-btn' onClick={this.middleClickHandler} value={this.state.pageNumber + 2}>
                    <a className='pagination-link'>{this.state.pageNumber + 2}</a>
                </li>
            );  
        }
        else if(parseInt(this.props.count) - this.state.pageNumber == 1){            
            result.push(
                <li className='pagination-btn pagination-middle-btn in-range-btn' onClick={this.middleClickHandler} value={this.state.pageNumber + 1}>
                    <a className='pagination-link'>{this.state.pageNumber + 1}</a>
                </li>
            );
        }
        return result;
    }


    componentDidMount(){
        this.setState({pageNumber: this.props.initialPageNumber});
    }

    componentDidUpdate(){
        // console.info(this.props.initialPageNumber);
        // console.info(this.state.pageNumber);
        if(parseInt(this.props.initialPageNumber) !== parseInt(this.state.pageNumber) ||  parseInt(this.props.count) !==  parseInt(this.state.pageCount)){
            this.setState({
                pageNumber: parseInt(this.props.initialPageNumber),
                pageCount: parseInt(this.props.count)
            });
            this.checkOutOfRange(this.props.initialPageNumber);
        }
    }


    render(){
        return (
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start' onClick={this.previousClickHandler}>
                   <a className='pagination-link'>Previous</a>
                </li>
                <li className='pagination-btn pagination-middle-btn out-of-range-hidden-page-btn pag-minus-btn' onClick={this.middleClickHandler} value={this.state.pageNumber - 2}>
                    <a className='pagination-link'>{this.state.pageNumber - 2}</a>
                </li>
                <li className='pagination-btn pagination-middle-btn out-of-range-hidden-page-btn pag-minus-btn' onClick={this.middleClickHandler} value={this.state.pageNumber - 1}>
                    <a className='pagination-link'>{this.state.pageNumber - 1}</a>
                </li>
                {this.createMiddleButtons()}
                <li className='pagination-btn pagination-end' onClick={this.nextClickHandler}>
                    <a className='pagination-link'>Next</a>
                </li>
            </ul>
        );
    }

}

export default Pagination;