import React from 'react';
import "../../layout/Common.css";


class Pagination extends React.Component{
    constructor(props){
        super(props);
    }



    render(){
        return (
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start'>
                   <a className='pagination-link'>Previous</a>
                </li>
                <li className='pagination-btn pagination-middle-btn'>
                    <a className='pagination-link'>1</a>
                </li>
                <li className='pagination-btn pagination-middle-btn'>
                    <a className='pagination-link'>2</a>
                </li>
                <li className='pagination-btn pagination-middle-btn'>
                    <a className='pagination-link'>3</a>
                </li>
                <li className='pagination-btn pagination-end'>
                    <a className='pagination-link'>Next</a>
                </li>
            </ul>
        );
    }

}

export default Pagination;