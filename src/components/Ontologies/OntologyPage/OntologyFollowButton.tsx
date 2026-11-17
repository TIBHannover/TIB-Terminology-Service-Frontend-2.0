import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import { defaultFollowPreferences, followPreferenceOptions } from "../../../concepts/ontologyFollow";
import { useContext, useEffect, useState } from "react";
import { fetchFollowedOntologies, setOntologyFollow } from "../../../api/ontologyFollow";
import { fetchUserEmail, saveUserEmail } from "../../../api/user";
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
  const [needsEmail, setNeedsEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;
    setFollowing(null);
    setError("");
    if (user && process.env.REACT_APP_AUTH_FEATURE === "true" &&
      process.env.REACT_APP_ONTOLOGY_FOLLOW_FEATURE === "true") {
      Promise.all([fetchFollowedOntologies(), fetchUserEmail()])
        .then(([follows, result]) => {
          if (active) {
            setNeedsEmail(!result.email.trim());
            setEmailVerified(result.emailVerified);
            setFollowing(follows.some((follow) => follow.ontologyId === ontologyId.trim().toLowerCase()));
          }
        })
        .catch(() => {
          if (active) setError("Could not load follow or email status.");
        });
    }
    return () => { active = false; };
  }, [user, ontologyId, reload]);

  async function toggleFollow() {
    if (!user) {
      setShowLogin(true);
      setTimeout(() => setShowLogin(false), 1000);
      return;
    }
    if (!following) {
      setPreferences(defaultFollowPreferences);
      setError("");
      setBusy(true);
      try {
        const result = await fetchUserEmail();
        setNeedsEmail(!result.email.trim());
        setEmailVerified(result.emailVerified);
        setEmail("");
        setShowPreferences(true);
      } catch {
        setError("Could not load your notification email. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }
    saveFollow();
  }

  async function saveFollow() {
    setBusy(true);
    setError("");
    try {
      if (!following && needsEmail) {
        if (!email.trim()) {
          setError("Enter an email address to follow this ontology.");
          return;
        }
        const result = await saveUserEmail(email.trim());
        if (!result.email.trim()) {
          setError("Could not save your notification email. Please try again.");
          return;
        }
        setNeedsEmail(false);
        setEmailVerified(result.emailVerified);
      }
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
    <div className="stour-ontology-follow ontology-follow-control align-self-center d-inline-flex align-items-center gap-2">
      {user && following && !showPreferences && (needsEmail || !emailVerified) && (
        <span role="status" className="alert alert-warning small text-nowrap mb-0 px-2 py-1"
          title={needsEmail ? "Add an email in My Profile to receive ontology notifications." : "Confirm your email to receive ontology notifications."}>
          {needsEmail ? (
            <Link to={CommonUrlFactory.getProfileUrl()} className="alert-link text-decoration-underline">Add email to receive notifications</Link>
          ) : "Confirm email to receive notifications"}
        </span>
      )}
      <button
        type="button"
        className="btn btn-secondary text-nowrap"
        aria-pressed={following === true}
        disabled={busy || (!!user && following === null)}
        title={following
          ? "Unfollow to stop receiving email updates for this ontology."
          : "Follow to receive email about new non-private notes, issues or term requests, and publications. A notification email is required. Private notes never trigger emails."}
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
      <Modal className="ontology-follow-modal" show={showPreferences} onHide={() => !busy && setShowPreferences(false)} aria-labelledby="follow-modal-title">
        <form onSubmit={(event) => { event.preventDefault(); saveFollow(); }}>
        <Modal.Header closeButton={!busy}>
          <Modal.Title id="follow-modal-title">Follow {ontologyId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Follow this ontology to receive email when new content is added. Choose which updates you want below. You can change these choices in Followed ontologies.</p>
          <div className="alert alert-warning">A confirmed email is required to receive notifications. Confirm it using the activation link sent to your inbox. You can later add, change, or remove this email in My Profile. Private notes never trigger emails.</div>
          {needsEmail && (
            <div className="mb-3">
              <label className="form-label" htmlFor="follow-notification-email">Email address</label>
              <input id="follow-notification-email" className="form-control" type="email" autoComplete="email" maxLength={254} required
                value={email} disabled={busy} onChange={(event) => setEmail(event.target.value)} />
            </div>
          )}
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
        <Modal.Footer className="justify-content-between">
          <button type="button" className="btn btn-secondary follow-cancel-button" disabled={busy} onClick={() => setShowPreferences(false)}>Cancel</button>
          <button type="submit" className="btn btn-secondary" disabled={busy}>{busy ? "Saving…" : "Confirm follow"}</button>
        </Modal.Footer>
        </form>
      </Modal>
      <Login isModal={true} showModal={showLogin} withoutButton={true} />
    </div>
  );
};

export default OntologyFollowButton;
