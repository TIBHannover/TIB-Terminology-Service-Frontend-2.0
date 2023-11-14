import React from "react";
import NoteCommnentList from "./NoteCommentList";
import { getNoteDetail } from "../../../api/tsMicroBackendCalls";
import { NotFoundErrorPage } from "../../common/ErrorPages/ErrorPages";
import { buildNoteAboutPart } from "./helpers";
import { NoteCardHeader } from "./Cards";
import { withRouter } from 'react-router-dom';
import {createHtmlFromEditorJson, createTextEditorEmptyText}  from "../../common/TextEditor/TextEditor";




class NoteDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           note: {},
           noteContent: createTextEditorEmptyText(),
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
                    noteContent: createHtmlFromEditorJson(result['content']),
                    noteNotFound: false
                })
            }
        });
    }


    reloadNoteDetail(){
        let searchParams = new URLSearchParams(window.location.search);     
        searchParams.delete('comment');
        this.props.history.push(window.location.pathname + "?" +  searchParams.toString());
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
        if(process.env.REACT_APP_NOTE_FEATURE !== "true"){            
            return null;
        }                
        return [
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <NoteCardHeader note={this.state.note}   ontologyId={this.props.ontologyId} />              
                        </div>
                        <div class="card-body">
                            <h4 className="card-title note-list-title">{this.state.note['title']}</h4>
                            <small>
                                <ul className="">
                                    <li>type: {this.state.note['semantic_component_type']}</li>
                                    <li>About: {buildNoteAboutPart(this.state.note)}</li>
                                </ul>                            
                            </small>   
                            <hr></hr>
                            <p className="card-text">                                                            
                                <div dangerouslySetInnerHTML={{ __html: this.state.noteContent}}></div>                                
                            </p>                        
                        </div>
                    </div>                
                </div>
            </div>     
        ];
    }


    render(){
        if(this.state.noteNotFound){
            return (<NotFoundErrorPage />)
        }
        return(                           
            <span>
                {this.create_note_card()}                
                <NoteCommnentList 
                    note={this.state.note}  
                    noteDetailReloader={this.reloadNoteDetail}
                    ontologyId={this.props.ontologyId}    
                />
            </span>  
        );
    }

}

export default withRouter(NoteDetail);