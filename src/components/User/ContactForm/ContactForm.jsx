import DropDown from "../../common/DropDown/DropDown";
import TextEditor from "../../common/TextEditor/TextEditor";


const ContactForm = () => {


    const CONTACT_TYPES = [
        {label: "Question", value:0},
        {label: "Issue", value:1}        
    ];

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
                            dropDownValue={0}
                            // dropDownChangeHandler={props.changeArtifactType}
                        /> 
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-sm-8">
                        <label className="required_input" for="contact-form-title">Title</label>
                        <input 
                            type="text" 
                            // value={props.noteTitle} 
                            // onChange={() => {props.onTextInputChange()}}                                                 
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
                            editorState={null} 
                            // textChangeHandlerFunction={props.onTextAreaChange}
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
                            // onChange={() => {props.onTextInputChange()}}                                                 
                            class="form-control" 
                            id="contact-form-safe-q">
                        </input>
                    </div>
                </div>        
                <br></br>
                <div className="row">
                    <div className="col-sm-6">
                        <button type="button" class="btn btn-secondary">Submit</button>
                    </div>
                </div>                        
            </div>            
        </div>
    );

}

export default ContactForm;