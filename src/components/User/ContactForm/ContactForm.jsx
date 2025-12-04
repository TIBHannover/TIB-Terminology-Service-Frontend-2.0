import { useState } from "react";
import DropDown from "../../common/DropDown/DropDown";
import TextEditor from "../../common/TextEditor/TextEditor";
import { createHtmlFromEditorJson, getTextEditorContent } from "../../common/TextEditor/TextEditor";
import { sendContactFrom } from "../../../api/user";
import AlertBox from "../../common/Alerts/Alerts";
import FormLib from "../../../Libs/FormLib";


const ContactForm = (props) => {

  const { appErrorUrl, appErrorContent } = props;

  const [editorState, setEditorState] = useState(null);
  const [contactType, setContactType] = useState(!appErrorUrl ? 0 : "2");
  const [typeHintTextShow, setTypeHintTextShow] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
  const [randomNum1, setRandomNum1] = useState(getRandomInt(0, 11));
  const [randomNum2, setRandomNum2] = useState(getRandomInt(0, 11));


  const CONTACT_TYPES = [
    { label: "Choose ...", value: 0 },
    { label: "Question", value: 1 },
    { label: "Issue", value: 2 }
  ];


  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  };


  function onTextAreaChange(newEditorState) {
    document.getElementsByClassName('rdw-editor-main')[0].style.border = '';
    setEditorState(newEditorState);
  };



  function submit() {
    let formIsValid = true;
    let title = FormLib.getFieldByIdIfValid('contact-form-title');
    let username = !appErrorUrl ? FormLib.getFieldByIdIfValid('contact-form-username') : "";
    let email = !appErrorUrl ? FormLib.getFieldByIdIfValid('contact-form-email') : "";
    let safeAnswer = FormLib.getFieldByIdIfValid('contact-form-safe-q');
    let content = !appErrorUrl ? FormLib.getTextEditorValueIfValid(editorState, 'contact-form-text-editor') : appErrorContent;
    formIsValid = !appErrorUrl ? (title && username && email && safeAnswer && content) : safeAnswer;
    if (parseInt(contactType) === 0) {
      setTypeHintTextShow(true);
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    content = !appErrorUrl ? createHtmlFromEditorJson(content) : content;
    let data = {
      title: title,
      description: content,
      name: username,
      email: email,
      safeAnswer: safeAnswer,
      safeQuestion: randomNum1 + "+" + randomNum2,
      type: contactType,
      appError: !!appErrorUrl
    };

    sendContactFrom(data).then(success => {
      if (success) {
        setFormSubmitted(true);
        setFormSubmitSuccess(true);
        return true;
      }
      setFormSubmitted(true);
      setFormSubmitSuccess(false);
      return true;
    });
  }


  if (process.env.REACT_APP_CONTACT_FORM !== "true") {
    return <></>;
  }

  return (
    <div className="row">
      <div className="col-sm-12 user-info-panel">
        <h1>Contact us</h1>
        <br></br>
        {formSubmitted && formSubmitSuccess &&
          <>
            <AlertBox
              type="success"
              message="Thank you! Your query has been submitted successfully."
            />
            <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}>New message</a>
          </>
        }
        {formSubmitted && !formSubmitSuccess &&
          <>
            <AlertBox
              type="danger"
              message="Sorry! Something went wrong. Please try again later."
            />
            <a className="btn btn-secondary" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}>New message</a>
          </>
        }
        {!formSubmitted &&
          <>
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
                <label className={!appErrorUrl ? "required_input" : ""} htmlFor="contact-form-title">
                  {!appErrorUrl ? "Title" : "Error happened while visiting"}
                </label>
                <input
                  type="text"
                  onChange={() => { document.getElementById('contact-form-title').style.borderColor = ''; }}
                  class="form-control"
                  id="contact-form-title"
                  placeholder="Enter title for your query"
                  defaultValue={appErrorUrl ?? ""}
                  readOnly={appErrorUrl ? true : false}
                  disabled={appErrorUrl ? true : false}
                >
                </input>
              </div>
            </div>
            <br></br>
            {!appErrorUrl &&
              <div className="row">
                <div className="col-sm-8">
                  <TextEditor
                    editorState={editorState}
                    textChangeHandlerFunction={onTextAreaChange}
                    wrapperClassName=""
                    editorClassName=""
                    placeholder="Enter your query here"
                    textSizeOptions={['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']}
                    wrapperId="contact-form-text-editor"
                  />
                </div>
              </div>
            }
            {!appErrorUrl &&
              <div className="row mt-4">
                <div className="col-sm-8">
                  <label className="required_input" htmlFor="contact-form-username">Your Name</label>
                  <input
                    type="text"
                    onChange={() => { document.getElementById('contact-form-username').style.borderColor = ''; }}
                    class="form-control"
                    id="contact-form-username"
                    placeholder="Please enter your fullname">
                  </input>
                </div>
              </div>
            }
            {!appErrorUrl &&
              <div className="row mt-4">
                <div className="col-sm-8">
                  <label className="required_input" htmlFor="contact-form-email">Email</label>
                  <input
                    type="text"
                    onChange={() => { document.getElementById('contact-form-email').style.borderColor = ''; }}
                    class="form-control"
                    id="contact-form-email"
                    placeholder="Please enter your email">
                  </input>
                </div>
              </div>
            }
            <div className="row mt-4">
              <div className="col-sm-6">
                <label className="required_input" htmlFor="contact-form-safe-q">What is {randomNum1 + " + " + randomNum2}</label>
                <input
                  type="text"
                  onChange={() => { document.getElementById('contact-form-safe-q').style.borderColor = ''; }}
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
          </>
        }
      </div>
    </div>
  );

}

export default ContactForm;