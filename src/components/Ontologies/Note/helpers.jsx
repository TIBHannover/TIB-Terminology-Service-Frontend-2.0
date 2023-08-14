import AuthTool from "../../User/Login/authTools";


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
                    <div className="col-sm-6">
                        <small>{note['comments_count']}</small><i class="fa fa-comment" aria-hidden="true"></i>
                    </div>
                    <div className="col-sm-6" data-toggle="tooltip"  data-placement="top" title={VISIBILITY_HELP[note['visibility']]}>
                        <small><i class="fa-solid fa-eye"></i>{note['visibility']}</small>                        
                    </div>
                </div>                                                      
            </div>
        </div> 
    ];
}