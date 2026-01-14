import { useState } from "react";
import { createApiKey } from "../../../api/user";
import { TextInput, TextArea } from "../../common/Input/Input";
import AlertBox from "../../common/Alerts/Alerts";
import CopyLinkButton from "../../common/CopyButton/CopyButton";


const CreateApiKey = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");


  function submit() {
    if (!title) {
      let titleBox = document.getElementById('apikey-title') as HTMLInputElement;
      titleBox.style.borderColor = 'red';
      return;
    }
    setLoading(true);
    createApiKey({ name: name, description: description, title: title, expires_at: "2022-12-31T23:59:59Z" }).then((result) => {
      if (!result) {
        setLoading(false);
        setSubmitted(true);
        setSuccess(false);
        return;
      }
      setKey(result);
      setSuccess(true);
      setSubmitted(true);
      setLoading(false);
    });
  }



  return (
    <div className="row user-info-panel">
      <h5><b>Create a new API key.</b></h5>
      {loading && <div className="isLoading-btn"></div>}
      {!loading && submitted && !success && <AlertBox type="danger" message={"Something went wrong. Please try again later."} />}
      {!loading && submitted && success &&
        <div className="row text-center">
          <div className="col-sm-12">
            <div className="alert alert-success">
              Your API key has been created successfully. Please copy it to your clipboard since you will not be able to see it again.
              <br />
              <br />
              Your API key is:
              <br />
              {key}
              <br />
              <CopyLinkButton valueToCopy={key} tooltipText={"Copy your API key to clipboard"} />
            </div>
          </div>
        </div>
      }
      {!submitted && !loading &&
        <>
          <TextInput
            placeholder="Enter the title of the API key"
            id="apikey-title"
            defaultValue={title}
            label="Title"
            required={true}
            onchange={(e: React.ChangeEvent) => { setTitle((e.target as HTMLInputElement).value) }}
          />
          <TextInput
            placeholder="API key username"
            id="apikey-name"
            defaultValue={name}
            label="Username (Your content will be published under this name via API. If you leave it empty, your content will be published under your username)"
            onchange={(e: React.ChangeEvent) => { setName((e.target as HTMLInputElement).value) }}
          />
          <TextArea
            placeholder="Enter the description of the API key"
            id="apikey-description"
            defaultValue={description}
            label="Description"
            rows={5}
            onchange={(e: React.ChangeEvent) => { setDescription((e.target as HTMLTextAreaElement).value) }}
          />
          <button type="button" className="btn btn-secondary" onClick={submit}>Create</button>
        </>
      }
    </div>
  );
};

export default CreateApiKey;
