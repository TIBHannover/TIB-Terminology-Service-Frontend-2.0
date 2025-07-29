import {useState, useEffect, useContext} from "react";
import TextEditor from "../../../common/TextEditor/TextEditor";
import {RowWithSingleColumn} from "../../../common/Grid/BootstrapGrid";
import CommentCard from "../CommentCard";
import {AppContext} from "../../../../context/AppContext";
import Login from "../../../User/Login/TS/Login";


export const NoteCommentListRender = (props) => {
  
  const appContext = useContext(AppContext);
  
  const [commentListToRener, setCommentListToRener] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  
  useEffect(() => {
    createCommentList();
  }, [props.note]);
  
  
  function createCommentList() {
    let comments = props.note['comments'] ? props.note['comments'] : [];
    let result = [];
    for (let comment of comments) {
      result.push(
        <RowWithSingleColumn
          content={<CommentCard comment={comment} commentEditHandler={props.handleEditButton}/>}
          columnclassName="col-sm-12"
          rowclassName="note-comment-card"
        />
      );
    }
    setCommentListToRener(result);
  }
  
  
  const editor = <TextEditor
    editorState={props.commentEditorState}
    textChangeHandlerFunction={props.onTextAreaChange}
    wrapperClassName="note-comment-editor-warpper"
    editorClassName="note-comment-editor"
    placeholder="leave a comment ..."
    textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
  />
  
  const submitButton = !props.editMode && <button type="button" className="btn btn-secondary note-comment-submit-btn"
                                                  onClick={props.submitComment}>Comment</button>;
  const editButton = props.editMode &&
    <button type="button" className="btn btn-secondary note-comment-submit-btn" onClick={props.edit}>Edit</button>;
  const cancelButton = props.editMode &&
    <button type="button" className="btn btn-secondary note-comment-cancel-edit-btn"
            onClick={props.cancelEdit}>Cancel</button>;
  
  return (
    <div className="note-comment-container">
      {!props.editMode &&
        <RowWithSingleColumn
          content={commentListToRener}
          columnclassName="col-sm-12"
          rowclassName=""
        />
      }
      <hr></hr>
      {appContext.user &&
        [
          <RowWithSingleColumn
            content={editor}
            columnclassName="col-sm-12"
            rowclassName=""
          />,
          <RowWithSingleColumn
            content={submitButton}
            columnclassName="col-sm-12"
            rowclassName=""
          />,
          <RowWithSingleColumn
            content={[editButton, cancelButton]}
            columnclassName="col-sm-12"
            rowclassName=""
          />
        ]
      }
      {!appContext.user &&
        <div className="row">
          <div className="col-sm-12">
            <div className="row text-center">
              <div className="col-sm-12">
                <button type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setLoginModal(true);
                          setTimeout(() => setLoginModal(false), 1000);
                        }}
                
                >
                  Join this conversation
                </button>
              </div>
            </div>
            <Login isModal={true} showModal={loginModal} withoutButton={true}/>
          </div>
        </div>
      }
    </div>
  );
  
}