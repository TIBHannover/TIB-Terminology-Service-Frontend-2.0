import React from "react";



class TermRequest extends React.Component{



    render(){
        return(
            <span>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#term-request-modal">
                File a new Issue 
            </button>
            
            <div class="modal" id="term-request-modal">
                <div class="modal-dialog">
                    <div class="modal-content">                    
                        <div class="modal-header">
                            <h4 class="modal-title">File an issue for this Ontology</h4>
                            <button type="button" class="close close-mark-btn" data-dismiss="modal">&times;</button>
                        </div>
                        
                        <div class="modal-body">
                            <p>You can file a new issue here. The issue can have a General Topic or a new Term Request</p>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary close-term-request-modal-btn mr-auto" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary submit-term-request-modal-btn">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            </span>
        );
    }
}

export default TermRequest;