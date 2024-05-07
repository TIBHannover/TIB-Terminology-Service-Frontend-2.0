import { useState, useEffect } from "react";
import AddCollection from "./AddCollection";




const UserCollection = () => {


    return (
        <div className="row user-info-panel">
            <div className="col-sm-12">
                <h3>My Collections</h3>
                <br/>
                <div className="row">
                    <div className="col-sm-12">
                        <AddCollection />
                    </div>
                </div>
            </div>            
        </div>
    );

}

export default UserCollection;