import React from "react";
import AuthTool from "../../User/Login/authTools";
import ReactMarkdown from 'react-markdown';
import NoteCommnentList from "./NoteCommentList";



class NoteDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           note: {}           
        });
        this.getTheNote = this.getTheNote.bind(this);
        this.create_note_card = this.create_note_card.bind(this);        
    }


    getTheNote(){
        let noteId = this.props.noteId;
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
        let url =  process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/note?id=' + noteId + '&withComments=True';
        fetch(url, {headers:headers}).then((resp) => resp.json())
        .then((data) => {
            let note = data['_result']['note'];
            this.setState({
                note: note
            })
        }).catch((error) => {
            throw error
            // this.props.noteListSubmitStatusHandler(false);
            // document.getElementById('noteCreationCloseModal').click();
        });
    }


    componentDidMount(){
        if(this.props.noteId){
            this.getTheNote();
        }        
    }



    create_note_card(){
        return [
            <div className="row">
                <div className="col-sm-9">
                    <div className="card">
                        <div className="card-header">
                            {" Opened on " + this.state.note['created_at'] + " by "} 
                            <b>{AuthTool.getUserName(this.state.note['created_by'])}</b> 
                        </div>
                        <div class="card-body">
                            <h1 className="card-title note-list-title">{this.state.note['title']}</h1>
                            <p className="card-text">
                                <ReactMarkdown>{this.state.note['content']}</ReactMarkdown>
                            </p>                        
                        </div>
                    </div>                
                </div>
            </div>     
        ];
    }


    render(){
        return(                           
            <span>
                {this.create_note_card()}                
                <NoteCommnentList note={this.state.note}  />
            </span>  
        );
    }

}

export default NoteDetail;