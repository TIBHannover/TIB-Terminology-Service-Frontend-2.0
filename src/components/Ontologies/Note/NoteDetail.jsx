import React from "react";
import ReactMarkdown from 'react-markdown';
import NoteCommnentList from "./NoteCommentList";
import { getNoteDetail } from "../../../api/tsMicroBackendCalls";
import { NotFoundErrorPage } from "../../common/ErrorPages/ErrorPages";
import { buildNoteAboutPart } from "./helpers";
import { NoteCardHeader } from "./Cards";
import { withRouter } from 'react-router-dom';



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
        let searchParams = new URLSearchParams(window.location.search);        
        searchParams.delete('page');
        searchParams.delete('size');
        searchParams.delete('type');
        this.props.history.push(window.location.pathname + "?" +  searchParams.toString());         
    }



    create_note_card(){                        
        return [
            <div className="row">
                <div className="col-sm-9">
                    <div className="card">
                        <div className="card-header">
                            <NoteCardHeader note={this.state.note} />              
                        </div>
                        <div class="card-body">
                            <h1 className="card-title note-list-title">{this.state.note['title']}</h1>
                            <small>
                                <ul className="">
                                    <li>type: {this.state.note['semantic_component_type']}</li>
                                    <li>About: {buildNoteAboutPart(this.state.note)}</li>
                                </ul>                            
                            </small>   
                            <hr></hr>
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
            return (<NotFoundErrorPage />)
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

export default withRouter(NoteDetail);