import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import Auth from "../../../Libs/AuthLib";
import Login from "./TS/Login";
import { Link } from 'react-router-dom';



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
            <Link className="dropdown-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}>My Profile</Link>
            <Link className="dropdown-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections"}>My Ontology Collection</Link>
            {localStorage.getItem('authProvider') === 'github' && process.env.REACT_APP_GITHUB_ISSUE_REQUEST_FEATURE === "true" &&
              <Link className="dropdown-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"}>Submited Issue Requests</Link>
            }
            {appContext.isUserSystemAdmin &&
              <Link className="dropdown-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"}>{`Reports (${appContext.reportsListForAdmin.length})`}</Link>
            }
            <Link className="dropdown-item" to="#" onClick={() => { Auth.runLogout(); }}>Logout</Link>
          </div>
        </div>
      }
    </span>
  );
}



export default UserPanel;