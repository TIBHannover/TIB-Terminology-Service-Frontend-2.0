import Modal from "react-bootstrap/Modal";
import {useState} from "react";


const Login = (props) => {
  
  const [showModal, setShowModal] = useState(false);
  
  function getAuthenticationCode(e) {
    let authProvider = e.target.getAttribute("authProvider");
    let loginUrl = "";
    if (authProvider === "github") {
      loginUrl = process.env.REACT_APP_GITHUB_AUTH_BASE_URL;
      loginUrl += "&client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID;
    } else if (authProvider === "orcid") {
      loginUrl = process.env.REACT_APP_ORCID_AUTH_BASE_URL;
      loginUrl += "&client_id=" + process.env.REACT_APP_ORCID_CLIENT_ID;
    } else if (authProvider === "gitlab") {
      loginUrl = process.env.REACT_APP_GITLAB_AUTH_BASE_URL;
      loginUrl += "&client_id=" + process.env.REACT_APP_GITLAB_CLIENT_ID;
    } else if (authProvider === "native") {
      loginUrl = process.env.REACT_APP_REGAPP_AUTH_BASE_URL;
      loginUrl += "?client_id=" + process.env.REACT_APP_REGAPP_CLIENT_ID;
    }
    
    loginUrl += "&redirect_uri=" + process.env.REACT_APP_LOGIN_REDIRECT_URL;
    localStorage.setItem("authProvider", authProvider);
    localStorage.setItem("redirectUrl", window.location.href);
    window.location.replace(loginUrl);
  }
  
  
  function buildAuthButtons() {
    return [
      <span>
        <div className="row justify-content-center">
          <a onClick={getAuthenticationCode} authProvider="github"
             className="btn btn-secondary github-login-btn login-btn">
            <i className="fa fa-github"></i> Sign in with GitHub
          </a>
        </div>
        <br></br>
        <div className="row justify-content-center">
          <a onClick={getAuthenticationCode} authProvider="orcid"
             className="btn btn-secondary orcid-login-btn login-btn">
            <i className="fa-brands fa-orcid"></i> Sign in with ORCID
          </a>
        </div>
        <br/>
      </span>
    ];
  }
  
  
  function createLoginButton() {
    if (props.withoutButton) {
      return "";
    }
    if (props.customLoginBtn) {
      return props.customLoginBtn;
    }
    return <button className="login-btn-header btn-secondary" onClick={() => setShowModal(true)}>Login</button>;
  }
  
  
  if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
    return null;
  }
  
  const modalId = props.customModalId ? props.customModalId : "loginModal";
  
  return (
    <>
      {props.isModal &&
        // render the modal. Used in the site header 
        <span>
          {createLoginButton()}
          <Modal show={showModal} id={modalId}>
                <Modal.Header className="row">
                  <div className="col-sm-6">
                    <h5 className="modal-title" id="loginModalLabel">Login</h5>
                  </div>
                  <div className="col-sm-6 text-end">
                    <button className="close-btn-message-modal" onClick={() => setShowModal(false)}><span
                      aria-hidden="true">&times;</span></button>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  {(props.customLoginBtn || props.withoutButton) &&
                    <>
                      <div className="row">
                        <div className="col-sm-12">
                          <h5>You need to login for accessing this function.</h5>
                        </div>
                      </div>
                      <br></br>
                    </>
                  }
                  <div className="login-modal-hint-text">
                    <strong>Attention:</strong> Some of the features, such as term request, are only available if you
                    authenticate with Github.
                  </div>
                  <br></br>
                  {buildAuthButtons()}
                </Modal.Body>
          </Modal>
        </span>
      }
      {!props.isModal &&
        // render the normal login form. Used when a user need to login before accessing a section
        <div className="row">
          <div className="col-sm-12 text-center">
            <h5>You need to login for accessing this section.</h5>
            <div>
              <strong>Attention:</strong> Some of the features, such as term request, are only available if you
              authenticate with Github.
            </div>
            <br></br>
            {buildAuthButtons()}
          </div>
        </div>
      }
    </>
  );
  
  
}

export default Login;