import { useContext } from "react"
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../Alerts/Alerts";
import { sendResolveRequest } from "../../../api/tsMicroBackendCalls";



const ResolveReportActionsForAdmins = (props) => {

    const appContext = useContext(AppContext);


    async function sendResolveCommand(e){
        let resolveAction = e.target.value;        
        let redirectAfterDeleteEndpoint = window.location.href;
        let locationObject = window.location;
        let searchParams = new URLSearchParams(window.location.search);
        if (redirectAfterDeleteEndpoint.includes("noteId=")){
            // we are on the note page                
            searchParams.delete('noteId');                 
        }        
        redirectAfterDeleteEndpoint = locationObject.pathname + "?" +  searchParams.toString();
        let resolveStatus = await sendResolveRequest({
            objectType: props.objectType,
            objectId: props.objectId,
            action: resolveAction
        });
        if(resolveStatus){
            window.location.replace(redirectAfterDeleteEndpoint);
        }

    }



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
                    <button className="btn btn-danger mr-2" value="delete" onClick={sendResolveCommand}>delete</button>
                    <button className="btn btn-danger mr-2" value="delete-block" onClick={sendResolveCommand}>delete And block user</button>
                    <button className="btn btn-success" value="none" onClick={sendResolveCommand}>False Report</button>
                </div>            
            </div>
        </>
    );

}

export default ResolveReportActionsForAdmins;