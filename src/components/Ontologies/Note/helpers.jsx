import AuthTool from "../../User/Login/authTools";
import {DeleteModal, DeleteModalBtn} from "../../common/DeleteModal/DeleteModal";


const VISIBILITY_HELP = {
    "me": "Only you can see this Note.", 
    "internal": "Only the registered users in TS can see this Note.", 
    "public": "Everyone on the Internet can see this Note."
}


export function buildNoteCardHeader(note){
    const deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/delete';
    const callHeader = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
    const redirectAfterDeleteEndpoint = window.location.href;
    let deleteFormData = new FormData();
    deleteFormData.append("objectId", note['id']);
    deleteFormData.append("objectType", 'note');

    return [
        <div className="row">        
            <div className="col-sm-9">
                <small>
                    {"Opened on " + note['created_at'] + " by "} <b>{AuthTool.getUserName(note['created_by'])}</b> 
                </small>
            </div>
            <div className="col-sm-3">
                <div className="row">                    
                    <div className="col-sm-12 text-right">
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-secondary note-dropdown-toggle dropdown-toggle btn-sm note-dropdown-btn borderless-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu note-dropdown-menu" aria-labelledby="dropdownMenu2">                                
                                <div class="dropdown-item note-dropdown-item" data-toggle="tooltip"  data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
                                    <small><i class="fa-solid fa-eye"></i>{note['visibility']}</small>
                                </div>
                                {note['can_edit'] &&
                                    <span>
                                        <div class="dropdown-divider"></div>
                                        <div class="dropdown-item note-dropdown-item"><button type="button" class="btn btn-danger btn-sm note-edit-btn borderless-btn">Edit</button></div>
                                        <div class="dropdown-item note-dropdown-item">
                                            <DeleteModalBtn
                                                modalId={note['id']}                                                
                                             />
                                        </div>
                                    </span>                                    
                                }
                            </div>
                        </div>
                    </div>
                </div>                                                      
            </div>
            <DeleteModal
                modalId={note['id']}
                formData={deleteFormData}
                callHeaders={callHeader}
                deleteEndpoint={deleteEndpoint}
                afterDeleteRedirectUrl={redirectAfterDeleteEndpoint}
            />
        </div> 
    ];
}