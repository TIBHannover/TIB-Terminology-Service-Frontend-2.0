import React from "react";
import AuthTool from "../../User/Login/authTools";
import ReactMarkdown from 'react-markdown';
import NoteCommnentList from "./NoteCommentList";
import { errorNotFound } from "../../common/ErrorPages/ErrorPages";
import { getNoteDetail } from "../../../api/tsMicroBackendCalls";



class NoteDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           note: {},
           noteNotFound: false 
        });
        this.getTheNote = this.getTheNote.bind(this);
        this.create_note_card = this.create_note_card.bind(this); 
        this.reloadNoteDetail = this.reloadNoteDetail.bind(this);       
    }


    getTheNote(){
        let noteId = this.props.noteId;        
        getNoteDetail({noteId: noteId}).then((result) => {
            if(result === '404'){
                this.setState({noteNotFound: true});
            }
            else{
                this.setState({
                    note: result,
                    noteNotFound: false
                })
            }
        });
    }


    reloadNoteDetail(){
        this.setState({note: {}}, () => {
            this.getTheNote();
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
        if(this.state.noteNotFound){
            return errorNotFound();
        }
        return(                           
            <span>
                {this.create_note_card()}                
                <NoteCommnentList 
                    note={this.state.note}  
                    noteDetailReloader={this.reloadNoteDetail}    
                />
            </span>  
        );
    }

}

export default NoteDetail;