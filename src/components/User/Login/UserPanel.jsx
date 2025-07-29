import {useContext} from "react";
import {AppContext} from "../../../context/AppContext";
import Auth from "../../../Libs/AuthLib";
import Login from "./TS/Login";
import {Link} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';


const UserPanel = (props) => {
  
  const appContext = useContext(AppContext);
  
  
  if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
    return null;
  }
  
  return (
    <span>
      {!appContext.user &&
        <Login isModal={props.isModal}/>
      }
      {appContext.user &&
        <Dropdown>
          <Dropdown.Toggle className="btn btn-secondary user-profile-dropdown stour-login-in-header"
                           type="button" id="userProfileDropdown">
            {appContext.user.fullName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Link className="user-panel-item"
                    to={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My
                Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className="user-panel-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections"}>My
                Ontology
                Collection</Link>
            </Dropdown.Item>
            {process.env.REACT_APP_TERMSET_FEATURE === "true" &&
              <Dropdown.Item>
                <Link className="user-panel-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"}>My
                  Termsets</Link>
              </Dropdown.Item>
            }
            {localStorage.getItem('authProvider') === 'github' && process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE === "true" &&
              <Dropdown.Item>
                <Link className="user-panel-item"
                      to={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}>Submited
                  Issue Requests</Link>
              </Dropdown.Item>
            }
            {appContext.isUserSystemAdmin &&
              <Dropdown.Item>
                <Link className="user-panel-item"
                      to={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"}>{`Reports (${appContext.reportsListForAdmin.length})`}</Link>
              </Dropdown.Item>
            }
            <Dropdown.Item>
              <Link className="user-panel-item" to="#" onClick={() => {
                Auth.runLogout();
              }}>Logout</Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      }
    </span>
  );
}


export default UserPanel;