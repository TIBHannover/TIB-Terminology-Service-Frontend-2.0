import React from "react";


export const AlertBox = (props) => {
    return (
        <div className="row text-center">
            <div className={props.alertColumnClass}>                                    
                <div class={"alert alert-" + props.type}>
                   {props.message}                          
                </div>                        
            </div>
        </div>
    );
}



export const CopiedSuccessAlert = (props) =>{
    return (
        <div className="note-link-copy-message">
            <i class="fa fa-check" aria-hidden="true"></i>
            <small>{props.message}</small>
        </div>
    );
}


export default AlertBox;