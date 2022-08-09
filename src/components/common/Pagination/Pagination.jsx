import React from 'react';
import "../../layout/Common.css";


class Pagination extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            pageNumber: 1
        });
        this.previousClickHandler = this.previousClickHandler.bind(this);
        this.nextClickHandler = this.nextClickHandler.bind(this);
        this.middleClickHandler = this.middleClickHandler.bind(this);
    }

    previousClickHandler(){

    }

    nextClickHandler(){

    }

    middleClickHandler(){

    }


    render(){
        return (
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start' onClick={this.previousClickHandler}>
                   <a className='pagination-link'>Previous</a>
                </li>
                <li className='pagination-btn pagination-middle-btn' onClick={this.middleClickHandler}>
                    <a className='pagination-link'>1</a>
                </li>
                <li className='pagination-btn pagination-middle-btn' onClick={this.middleClickHandler}>
                    <a className='pagination-link'>2</a>
                </li>
                <li className='pagination-btn pagination-middle-btn' onClick={this.middleClickHandler}>
                    <a className='pagination-link'>3</a>
                </li>
                <li className='pagination-btn pagination-end' onClick={this.nextClickHandler}>
                    <a className='pagination-link'>Next</a>
                </li>
            </ul>
        );
    }

}

export default Pagination;