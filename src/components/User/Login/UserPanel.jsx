import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import Auth from "../../../Libs/AuthLib";
import Login from "./TS/Login";



const UserPanel = (props) => {

  const appContext = useContext(AppContext);


  if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
    return null;
  }

  return (
    <span>
      {!appContext.user &&
        <Login isModal={props.isModal} />
      }
      {appContext.user &&
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle user-profile-dropdown stour-login-in-header" type="button" id="userProfileDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {appContext.user.fullName}
          </button>
          <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userProfileDropdown">
            <a className="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</a>
            <a className="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections"}>My Ontology Collection</a>
            {localStorage.getItem('authProvider') === 'github' && process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE === "true" &&
              <a className="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}>Submited Issue Requests</a>
            }
            {appContext.isUserSystemAdmin &&
              <a className="dropdown-item" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"}>{`Reports (${appContext.reportsListForAdmin.length})`}</a>
            }
            <a className="dropdown-item" href="#" onClick={() => { Auth.runLogout(); }}>Logout</a>
          </div>
        </div>
      }
    </span>
  );
}



export default UserPanel;