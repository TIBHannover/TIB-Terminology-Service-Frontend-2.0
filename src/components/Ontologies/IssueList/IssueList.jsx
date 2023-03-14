import React from "react";
import { userIsLoginByLocalStorage } from "../../User/Login/Auth";
import Login from "../../User/Login/Login";


class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            listOfIssues: []
        });
    }


    setComponentData(){
        
    }



    render(){
        return (
            <div className="row tree-view-container">
                <div className="col-sm-12">
                    {!userIsLoginByLocalStorage() && 
                        <Login isModal={false} />
                    }
                    {userIsLoginByLocalStorage() &&
                        <div className="row">
                            Issues
                        </div>
                    }
                </div>
            </div>
            
        );
    }



}

export default IssueList;