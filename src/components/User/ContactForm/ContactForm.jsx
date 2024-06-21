import { useState } from "react";
import DropDown from "../../common/DropDown/DropDown";
import TextEditor from "../../common/TextEditor/TextEditor";
import { getTextEditorContent } from "../../common/TextEditor/TextEditor";


const ContactForm = () => {

    const [editorState, setEditorState] = useState(null);
    const [contactType, setContactType] = useState(0);
    const [typeHintTextShow, setTypeHintTextShow] = useState(false);


    const CONTACT_TYPES = [
        {label: "Choose ...", value:0},
        {label: "Question", value:1},
        {label: "Issue", value:2}        
    ];


    function onTextAreaChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };



    function submit(){
        let formIsValid = true;
        let title = document.getElementById('contact-form-title').value;
        let safeQuestion = document.getElementById('contact-form-safe-q').value;
        let content = "";                     
        if(!editorState){            
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }
        else{
            content = getTextEditorContent(editorState);
        }
        if(!title || title.trim() === ""){
            document.getElementById('contact-form-title').style.borderColor = 'red';
            formIsValid = false;
        }
        if(!safeQuestion || safeQuestion.trim() === ""){
            document.getElementById('contact-form-safe-q').style.borderColor = 'red';
            formIsValid = false;
        }
        
        if(!content || content.trim() === ""){
            document.getElementsByClassName('rdw-editor-main')[0].style.border = '1px solid red';
            formIsValid = false;
        }

        if(parseInt(contactType) === 0){
            setTypeHintTextShow(true);
            formIsValid = false;
        }

        if(!formIsValid){
            return;
        }


        return;
    }



    return (
        <div className="row">
            <div className="col-sm-12 user-info-panel">
                <h1>Contact us</h1>
                <br></br>
                <div className="row">
                    <div className="col-sm-8">
                        <DropDown 
                            options={CONTACT_TYPES}
                            dropDownId="contact-types"
                            dropDownTitle="I like to submit a"
                            dropDownValue={contactType}
                            dropDownChangeHandler={(e) => {
                                setContactType(e.target.value);
                                setTypeHintTextShow(false);
                            }}
                            mandatory={true}
                        /> 
                        {typeHintTextShow && <small className="text-danger"><i>Please choose</i></small>}
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-8">
                        <label className="required_input" for="contact-form-title">Title</label>
                        <input 
                            type="text"                             
                            onChange={() => {document.getElementById('contact-form-title').style.borderColor = '';}}                                                 
                            class="form-control" 
                            id="contact-form-title"
                            placeholder="Enter Title for your query">
                        </input>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-8">
                        <TextEditor 
                            editorState={editorState} 
                            textChangeHandlerFunction={onTextAreaChange}
                            wrapperClassName=""
                            editorClassName=""
                            placeholder="Enter your query here"
                            textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                        />  
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-6">
                        <label className="required_input" for="contact-form-safe-q">What is 5 + 7 </label>
                        <input 
                            type="text"                             
                            onChange={() => {document.getElementById('contact-form-safe-q').style.borderColor = '';}}                                                 
                            class="form-control" 
                            id="contact-form-safe-q">
                        </input>
                    </div>
                </div>        
                <br></br>
                <div className="row">
                    <div className="col-sm-6">
                        <button type="button" class="btn btn-secondary" onClick={submit}>Submit</button>
                    </div>
                </div>                        
            </div>            
        </div>
    );

}

export default ContactForm;