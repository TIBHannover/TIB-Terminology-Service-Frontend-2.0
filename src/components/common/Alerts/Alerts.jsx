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


export default AlertBox;