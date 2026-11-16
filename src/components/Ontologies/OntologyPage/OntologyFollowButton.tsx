import Modal from "react-bootstrap/Modal";
import { defaultFollowPreferences, followPreferenceOptions } from "../../../concepts/ontologyFollow";
import { useContext, useEffect, useState } from "react";
import { fetchFollowedOntologies, setOntologyFollow } from "../../../api/ontologyFollow";
import { AppContext } from "../../../context/AppContext";
import { TsOntology } from "../../../concepts/ontology";
import Login from "../../User/Login/TS/Login";

const OntologyFollowButton = ({ ontology }: { ontology: TsOntology }) => {
  const ontologyId = ontology.ontologyId;
  const repository = ontology.githubRepository;
  const { user } = useContext(AppContext);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(defaultFollowPreferences);

  useEffect(() => {
    let active = true;
    setFollowing(null);
    setError("");
    if (user && process.env.REACT_APP_AUTH_FEATURE === "true" &&
      process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE === "true") {
      fetchFollowedOntologies()
        .then((follows) => {
          if (active) setFollowing(follows.some((follow) => follow.ontologyId === ontologyId.trim().toLowerCase()));
        })
        .catch(() => {
          if (active) setError("Could not load follow status.");
        });
    }
    return () => { active = false; };
  }, [user, ontologyId, reload]);

  function toggleFollow() {
    if (!user) {
      setShowLogin(true);
      setTimeout(() => setShowLogin(false), 1000);
      return;
    }
    if (!following) {
      setPreferences(defaultFollowPreferences);
      setError("");
      setShowPreferences(true);
      return;
    }
    saveFollow();
  }

  async function saveFollow() {
    setBusy(true);
    setError("");
    try {
      const result = await setOntologyFollow(ontologyId, !following, { ...preferences, notifyGithub: !!repository && preferences.notifyGithub });
      setFollowing(result);
      setShowPreferences(false);
    } catch {
      setError("Could not update follow status. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (process.env.REACT_APP_AUTH_FEATURE !== "true" ||
    process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE !== "true") return null;

  return (
    <div className="stour-ontology-follow ontology-follow-control align-self-center">
      <button
        type="button"
        className="btn btn-secondary text-nowrap"
        aria-pressed={following === true}
        disabled={busy || (!!user && following === null)}
        title={following
          ? "Unfollow to stop receiving email updates for this ontology."
          : "Follow to receive email about new non-private notes, issues or term requests, and publications. Add your email in My Profile. Private notes never trigger emails."}
        onClick={toggleFollow}
      >
        {busy ? "Saving…" : user && following === null && !error ? "Loading…" : following ? "Unfollow" : "Follow"}
      </button>
      {error && !showPreferences && (
        <div role="alert" className="ontology-follow-feedback small bg-white border rounded p-2 shadow-sm">
          {error} {following === null && (
            <button type="button" className="btn btn-link btn-sm" onClick={() => setReload(reload + 1)}>Retry</button>
          )}
        </div>
      )}
      <Modal show={showPreferences} onHide={() => !busy && setShowPreferences(false)} aria-labelledby="follow-modal-title">
        <Modal.Header closeButton={!busy}>
          <Modal.Title id="follow-modal-title">Follow {ontologyId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Follow this ontology to receive email when new content is added. Choose which updates you want below. You can change these choices in Followed ontologies.</p>
          <p>Add your notification email in My Profile to receive updates. Private notes never trigger emails.</p>
          {followPreferenceOptions.map(({ key, label }) => (
            <div className="form-check" key={key}>
              <input className="form-check-input" type="checkbox" id={`follow-${key}`} checked={key === "notifyGithub" ? !!repository && preferences[key] : preferences[key]} disabled={busy || (key === "notifyGithub" && !repository)}
                onChange={(event) => setPreferences({ ...preferences, [key]: event.target.checked })} />
              <label className="form-check-label" htmlFor={`follow-${key}`}>{label}</label>
            </div>
          ))}
          <p className="small mt-3">GitHub activity includes new issues and commits on the main/master branch, summarized daily at 7 am Europe/Berlin.</p>
          {repository === "" && <p className="small">GitHub updates are unavailable because this ontology is not hosted on GitHub.</p>}
          {error && <div role="alert" className="text-danger mt-3">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setShowPreferences(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={saveFollow}>{busy ? "Saving…" : "Confirm follow"}</button>
        </Modal.Footer>
      </Modal>
      <Login isModal={true} showModal={showLogin} withoutButton={true} />
    </div>
  );
};

export default OntologyFollowButton;
