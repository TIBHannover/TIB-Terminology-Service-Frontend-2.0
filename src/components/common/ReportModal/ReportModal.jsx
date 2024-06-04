import {useState, useContext} from "react";
import AlertBox from "../Alerts/Alerts";
import { AppContext } from "../../../context/AppContext";
import Login from "../../User/Login/TS/Login";


export const ReportModalBtn = (props) => {

    const appContext = useContext(AppContext);

    if(!appContext.user){
        const loginModalId = "loginModalReport";
        return <button type="button" 
                    class="btn btn-sm borderless-btn note-action-menu-btn" 
                    data-toggle="modal" 
                    data-target={"#" + loginModalId}
                    data-backdrop="static"                                                         
                    >
                    Report
                </button>        
    }

    return (
        <button type="button" 
                class="btn btn-sm borderless-btn note-action-menu-btn" 
                data-toggle="modal" 
                data-target={"#reportModal" + props.modalId}
                data-backdrop="static"
                >
                Report
        </button>
    );
}



export const ReportModal = (props) => {

    const [submited, setSubmited] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);       
    
    const report = async () => {        
        try{
            props.formData.append('content', document.getElementById("reportReason" + props.modalId).value);
            let postConfig = {method: 'POST',  headers:props.callHeaders, body: props.formData};                        
            let result = await fetch(props.reportEndpoint, postConfig);
            setSubmited(true);
            setReportSuccess(result.ok)
        }
        catch(e){
            setSubmited(true);
            setReportSuccess(false);
        }
    }
    

    return (
        <div>            
            <div class="modal fade" id={"reportModal" + props.modalId} tabindex="-1" role="dialog" aria-labelledby={"reportModalLabel" + props.modalId} aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id={"reportModalLabel" + props.modalId}>Report Content</h5>
                            {!submited && 
                                <button type="button" class="close close-btn-message-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            }
                        </div>
                        <div class="modal-body">
                            {!submited && 
                                <>
                                <div class="mb-3">
                                    <label for={"reportReason" + props.modalId} class="form-label">Please describe briefly the reason for this report</label>
                                    <textarea class="form-control" id={"reportReason" + props.modalId} rows="3"></textarea>
                                </div>
                                <a href={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse?section=3"} target="_blank">Terms of Use</a>
                                </>
                            }
                            {submited && reportSuccess &&
                                <AlertBox 
                                    type="success"
                                    message="Thank you for the Report! We will examine it as soon as possible."
                                    alertColumnClass="col-sm-12"                                    
                                />                                
                            }
                            {submited && !reportSuccess &&
                                <AlertBox
                                    type="danger" 
                                    message="Something went wrong. Please try again!"
                                    alertColumnClass="col-sm-12"
                                />                                 
                            }
                        </div>
                        <div class="modal-footer justify-content-center">                            
                            {!submited && <button type="button" class="btn btn-secondary" onClick={report}>Submit</button>}
                            {submited && <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}


export default ReportModalBtn;


