import { useContext, useEffect, useState } from "react";
import { fetchFollowedOntologies, setOntologyFollow } from "../../../api/ontologyFollow";
import { AppContext } from "../../../context/AppContext";
import Login from "../../User/Login/TS/Login";

const OntologyFollowButton = ({ ontologyId }: { ontologyId: string }) => {
  const { user } = useContext(AppContext);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let active = true;
    setFollowing(null);
    setError("");
    if (user && process.env.REACT_APP_AUTH_FEATURE === "true") {
      fetchFollowedOntologies()
        .then((ids) => {
          if (active) setFollowing(ids.includes(ontologyId.trim().toLowerCase()));
        })
        .catch(() => {
          if (active) setError("Could not load follow status.");
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
    setBusy(true);
    setError("");
    try {
      const result = await setOntologyFollow(ontologyId, !following);
      setFollowing(result);
    } catch {
      setError("Could not update follow status. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (process.env.REACT_APP_AUTH_FEATURE !== "true") return null;

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
      {error && (
        <div role="alert" className="ontology-follow-feedback small bg-white border rounded p-2 shadow-sm">
          {error} {following === null && (
            <button type="button" className="btn btn-link btn-sm" onClick={() => setReload(reload + 1)}>Retry</button>
          )}
        </div>
      )}
      <Login isModal={true} showModal={showLogin} withoutButton={true} />
    </div>
  );
};

export default OntologyFollowButton;
