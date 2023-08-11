import React from "react";
import AuthTool from "../../User/Login/authTools";
import ReactMarkdown from 'react-markdown'



class NoteDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
           note: {}
        });
        this.getTheNote = this.getTheNote.bind(this);
    }


    getTheNote(){
        let noteId = this.props.noteId;
        let headers = AuthTool.setHeaderForTsMicroBackend({withAccessToken:true});
        let url =  process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + '/note/note?id=' + noteId;
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


    render(){
        return(                           
            <div className="row">
                <div className="col-sm-12">
                    <br></br>  
                    <h2>{this.state.note['title']}</h2>                      
                    <small>{" opened on " + this.state.note['created_at'] + " by " + AuthTool.getUserName(this.state.note['created_by'])}</small>
                    <br></br>
                    <br></br>
                    <span>
                        <ReactMarkdown>{this.state.note['content']}</ReactMarkdown>
                    </span>
                
                </div>
            </div>            
        );
    }

}

export default NoteDetail;