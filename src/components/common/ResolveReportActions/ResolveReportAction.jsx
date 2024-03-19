import { useContext } from "react"
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../Alerts/Alerts";



const ResolveReportActionsForAdmins = () => {

    const appContext = useContext(AppContext);

    if(!appContext.isUserSystemAdmin){
        return "";
    }

    return (
        <>
            <AlertBox 
                type="danger"
                message="Attention! This Content is Reported and needs action!"
            />
            <div className="row">
                <div className="col-sm-12">
                    <button className="btn btn-danger mr-2">delete</button>
                    <button className="btn btn-danger mr-2">delete And block user</button>
                    <button className="btn btn-success">False Report</button>
                </div>            
            </div>
        </>
    );

}

export default ResolveReportActionsForAdmins;