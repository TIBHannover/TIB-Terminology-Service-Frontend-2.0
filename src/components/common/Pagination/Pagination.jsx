import React from 'react';


class Pagination extends React.Component{
    constructor(props){
        super(props);
    }



    render(){
        return (
            <div className='row'>
                <div className='pagination-start-end'>
                    Previous
                </div>
                <div className='pagination-middle-btn'>
                    1
                </div>
                <div className='pagination-middle-btn'>
                    2
                </div>
                <div className='pagination-middle-btn'>
                    3
                </div>
                <div className='pagination-start-end'>
                    Next
                </div>
            </div>
        );
    }

}

export default Pagination;