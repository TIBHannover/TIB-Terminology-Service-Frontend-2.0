import { lazy, Suspense, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import NotificationEmail from "./NotificationEmail";
import { AppContext } from "../../../context/AppContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import "../../layout/ontologyHomePage.css";

const FollowedOntologies = lazy(() => import("../FollowedOntologies/FollowedOntologies"));
const UserApiKey = lazy(() => import("../APIKEY/ApiKey"));

const UserProfile = () => {
  const appContext = useContext(AppContext);
  const { section = "info" } = useParams<{ section?: string }>();
  const notificationsEnabled = process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE === "true";
  const activeSection = section === "apikey" || (section === "notifications" && notificationsEnabled) ? section : "info";

  function buildGitProfile() {
    return [
      <tbody>
        <tr>
          <td>Name</td>
          <td>{appContext.user.fullName}</td>
        </tr>
        <tr>
          <td>Homepage</td>
          <td>
            <a href={appContext.user.githubHomeUrl} target={"_blank"} rel="noopener noreferrer">
              {appContext.user.githubHomeUrl}
            </a>
          </td>
        </tr>
        <tr>
          <td>Organization</td>
          <td> {appContext.user.company}</td>
        </tr>
      </tbody>,
    ];
  }

  function buildOrcidProfile() {
    return [
      <tbody>
        <tr>
          <td>Name</td>
          <td>{appContext.user.fullName}</td>
        </tr>
        <tr>
          <td>ORCID ID</td>
          <td> {appContext.user.orcidId}</td>
        </tr>
      </tbody>,
    ];
  }

  if (process.env.REACT_APP_AUTH_FEATURE !== "true") {
    return null;
  }
  return (
    <div className="user-profile-container">
      <h1 className="h4 mb-4">My Profile</h1>
      <div className="row">
        <nav className="col-md-3 col-lg-2" aria-label="Profile">
          {(["info", "notifications", "apikey"] as const).filter((tab) => tab !== "notifications" || notificationsEnabled).map((tab) => (
            <div key={tab} className={"ontology-detail-nav-item" + (activeSection === tab ? " nav-item-active" : "")}>
              <Link className="nav-link" to={CommonUrlFactory.getProfileUrl(tab)} aria-current={activeSection === tab ? "page" : undefined}>
                {tab === "info" ? "Info" : tab === "notifications" ? "Notifications" : "API key"}
              </Link>
            </div>
          ))}
        </nav>
        <div className="col-md-9 col-lg-10">
          <div className="rounded-2 bg-white p-4">
            {activeSection === "info" && <>
              <h2 className="h5">Info</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  {localStorage.getItem("authProvider") === "orcid"
                    ? buildOrcidProfile()
                    : buildGitProfile()}
                </table>
              </div>
            </>}
            <Suspense fallback={<p role="status">Loading profile section…</p>}>
              {activeSection === "notifications" && <>
                <h2 className="h5">Notifications</h2>
                <NotificationEmail />
                <hr className="my-4" />
                <FollowedOntologies />
              </>}
              {activeSection === "apikey" && <>
                <h2 className="h5">API key</h2>
                <UserApiKey />
              </>}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
