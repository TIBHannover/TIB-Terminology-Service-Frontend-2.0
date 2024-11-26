import { useState, useContext } from "react";
import { AppContext } from "../../../../context/AppContext";
import Multiselect from "multiselect-react-dropdown";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCollectionWithOntologyList } from "../../../../api/collection";
import { submitOntologySuggestion } from "../../../../api/ontology";
import TextEditor from "../../../common/TextEditor/TextEditor";
import { OntologyPageContext } from "../../../../context/OntologyPageContext";
import draftToMarkdown from 'draftjs-to-markdown';
import {convertToRaw } from 'draft-js';
import AlertBox from "../../../common/Alerts/Alerts";
import FormLib from "../../../../Libs/FormLib";


const CollectionSuggestion = () => {
    const appContext = useContext(AppContext);
    const ontoPageContext = useContext(OntologyPageContext);

    const [selectedCollections, setSelectedCollections] = useState([]);
    const [editorState, setEditorState] = useState(null);    
    const [submitWait, setSubmitWait] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
    

    const collectionWithOntologyListQuery = useQuery({
        queryKey: ['allCollectionsWithTheirOntologies'],
        queryFn: fetchAllCollectionWithOntologyList
    });

    let collectionIds = [];
    if(collectionWithOntologyListQuery.data){
        for(let res of collectionWithOntologyListQuery.data){
            let ontoIsPartOfCollection = false;
            for(let classif of ontoPageContext.ontology?.config?.classifications){
                console.log(classif)
                if (classif.collection && classif.collection[0] === res['collection']){
                    ontoIsPartOfCollection = true;
                    break;
                }
            }
            if(!ontoIsPartOfCollection){
                collectionIds.push(res['collection']);
            }
        }
    }
    const collections = collectionIds;

    
    function onSelectRemoveCollection(selectedList, selectedItem){
        setSelectedCollections(selectedList);
    }

    function onTextEditorChange (newEditorState){
        document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
        setEditorState(newEditorState);                
    };


    function submit(){
        let username = FormLib.getFieldByIdIfValid('col-suggest-username');
        let email = FormLib.getFieldByIdIfValid('col-suggest-email');
        let reason = FormLib.getTextEditorValueIfValid(editorState, 'contact-form-text-editor');
        if(selectedCollections.length === 0){
            document.getElementsByClassName('searchWrapper')[0].style.borderColor = 'red';
        }
        if(!username || !email || !editorState || selectedCollections.length === 0){
            return;
        }
    
        let collectionIds = "";
        for(let collectionId of selectedCollections){
            collectionIds += collectionId + ",";
        }
        reason = editorState.getCurrentContent();        
        reason = draftToMarkdown(convertToRaw(reason));
        const form = {
            "username": username,
            "email": email,
            "reason": reason,        
            "name": ontoPageContext.ontology?.ontologyId,
            "purl": ontoPageContext.ontology?.config?.id,
            "collection_ids": collectionIds.slice(0, -1),
            "collection_suggestion": true
        }

        submitOntologySuggestion(form).then((result) => {            
            setFormSubmitSuccess(result);                
            setFormSubmitted(true);
            setSubmitWait(false);
        });
        
    }


    if(!appContext.user){
        return ""
    }

    return(
        <>
            <div className="modal fade" id={'collectionSuggestionModal'} tabindex="-1" role="dialog" aria-labelledby={"collectionSuggestionModalLabel"} aria-hidden="true">
                <div className="modal-dialog" role="document" id="collectionSuggestionModalDialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={"collectionSuggestionModalLabel"}>{"Collection Suggestion"}</h5>                            
                        </div>
                        <div className="modal-body">
                            {!submitWait && formSubmitSuccess && formSubmitted &&
                                <AlertBox
                                    type="success"
                                    message="Thank you! Your query has been submitted successfully. We will inform you about our decision via email."
                                />  
                            }
                            {!submitWait && !formSubmitSuccess && formSubmitted && 
                                <AlertBox
                                    type="danger"
                                    message="Sorry! Something went wrong. Please try again later."
                                />   
                            }
                            {submitWait && !formSubmitted &&
                                <div className="row">
                                    <div className="col-12 text-center">                
                                        <div class="spinner-border text-dark" role="status">
                                            <span class="visually-hidden"></span>                            
                                        </div>
                                        <div className="">Please wait ...</div>
                                    </div>
                                </div>
                            }
                            {!submitWait && !formSubmitted && 
                            <> 
                            <div className="row">
                                <div className="col-sm-8">
                                    <label className="required_input">Please choose the target collection(s)</label>
                                    <Multiselect
                                        isObject={false}
                                        options={collections}  
                                        selectedValues={selectedCollections}
                                        onSelect={onSelectRemoveCollection}
                                        onRemove={onSelectRemoveCollection}                        
                                        avoidHighlightFirstOption={true}                                        
                                        closeIcon={"cancel"}
                                        id="onto-suggest-collection"
                                        placeholder="Click here to select collections"
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-sm-8">
                                    <label className="required_input" for="col-suggest-username">Your name</label>
                                    <input 
                                        type="text"
                                        onChange={(e) => {e.target.style.borderColor = '';}}                                                    
                                        class="form-control" 
                                        id="col-suggest-username"
                                        placeholder="Enter your fullname. E.g., John Doe"                         
                                        >
                                    </input>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-sm-8">
                                    <label className="required_input" for="col-suggest-email">Email</label>
                                    <small> (we use this email to inform you about our decision regarding adding this ontology to the chosen collections.)</small>
                                    <input 
                                        type="text"
                                        onChange={(e) => {e.target.style.borderColor = ''; }}                                                 
                                        class="form-control" 
                                        id="col-suggest-email"
                                        placeholder="Enter your email"
                                        >
                                    </input>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-sm-8">
                                    <label className="required_input">Reason</label>
                                    <TextEditor 
                                        editorState={editorState} 
                                        textChangeHandlerFunction={onTextEditorChange}
                                        wrapperClassName=""
                                        editorClassName=""
                                        placeholder="Please briefly describe why this ontology needs to be part of the target collections."
                                        textSizeOptions={['Normal']}
                                        wrapperId="contact-form-text-editor"
                                    />  
                                </div>
                            </div>
                            <br/>
                            </>
                            }               
                        </div>
                        <div className="modal-footer">
                            <div className="col-auto mr-auto">
                                <button type="button" className="btn btn-secondary close-btn-message-modal float-right" data-dismiss="modal">Close</button>
                            </div>                             
                            {!submitWait && !formSubmitted &&
                                <button type="button" className="btn btn-secondary" onClick={submit}>Submit</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CollectionSuggestion;