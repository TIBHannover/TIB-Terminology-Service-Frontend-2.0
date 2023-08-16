import AuthTool from "../../User/Login/authTools";
import DeleteModal from "../../common/DeleteModal/DeleteModal";


const VISIBILITY_HELP = {
    "me": "Only you can see this Note.", 
    "internal": "Only the registered users in TS can see this Note.", 
    "public": "Everyone on the Internet can see this Note."
}



export function buildNoteCardHeader(note){
    return [
        <div className="row">
            <div className="col-sm-9">
                <small>
                    {" Opened on " + note['created_at'] + " by "} <b>{AuthTool.getUserName(note['created_by'])}</b> 
                </small>
            </div>
            <div className="col-sm-3">
                <div className="row">                    
                    <div className="col-sm-12 text-right">
                        <div class="dropdown custom-dropdown">
                            <button class="btn btn-secondary dropdown-toggle btn-sm note-dropdown-btn" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">                                
                                <div class="dropdown-item" data-toggle="tooltip"  data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
                                    <small><i class="fa-solid fa-eye"></i>{note['visibility']}</small>
                                </div>
                                <div class="dropdown-divider"></div>
                                <div class="dropdown-item"><DeleteModal /></div>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                    
                    
                    {/* <div className="col-xs-3 col-sm-3 col-md-4 text-nowrap note-header-meta">
                        <i class="fa fa-comment" aria-hidden="true"></i><small>{note['comments_count']}</small>
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-4 text-nowrap note-header-meta" data-toggle="tooltip"  data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
                        <small><i class="fa-solid fa-eye"></i>{note['visibility']}</small>                        
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-4 text-nowrap note-header-meta">
                        <DeleteModal />              
                    </div> */}
                </div>                                                      
            </div>
        </div> 
    ];
}