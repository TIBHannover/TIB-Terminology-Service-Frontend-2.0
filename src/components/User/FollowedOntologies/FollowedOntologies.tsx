import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFollowedOntologies, setOntologyFollow } from "../../../api/ontologyFollow";
import { AppContext } from "../../../context/AppContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import AlertBox from "../../common/Alerts/Alerts";

const FollowedOntologies = () => {
  const { user } = useContext(AppContext);
  const [ontologyIds, setOntologyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoaded(false);
    setOntologyIds([]);
    setError("");
    setMessage("");
    fetchFollowedOntologies()
      .then((ids) => {
        if (active) {
          setOntologyIds(ids);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active) setError("Could not load followed ontologies. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user, reload]);

  async function unfollow(ontologyId: string) {
    setPending(ontologyId);
    setError("");
    setMessage("");
    try {
      await setOntologyFollow(ontologyId, false);
      setOntologyIds((ids) => ids.filter((id) => id !== ontologyId));
      setMessage("Ontology unfollowed.");
    } catch {
      setError("Could not unfollow this ontology. Please try again.");
    } finally {
      setPending("");
    }
  }

  return (
    <div className="row user-info-panel">
      <div className="col-12">
        <h1 className="h4">Followed ontologies</h1>
        <p>
          Get email about new non-private notes, issues or term requests, and publications
          for these ontologies. Private notes never trigger emails.{" "}
          <Link to={CommonUrlFactory.getProfileUrl()}>Manage your notification email in My Profile</Link>.
        </p>
        {error && <AlertBox type="danger" message={error} />}
        <div role="status" aria-live="polite">{message}</div>
        {loading && <p role="status">Loading followed ontologies…</p>}
        {!loading && !loaded && (
          <button type="button" className="btn btn-secondary" onClick={() => setReload(reload + 1)}>Retry</button>
        )}
        {!loading && loaded && ontologyIds.length === 0 && <p>You are not following any ontologies yet.</p>}
        <ul className="list-group">
          {ontologyIds.map((id) => (
            <li key={id} className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2">
              <Link className="text-break" to={CommonUrlFactory.getOntologyUrl(id)}>{id}</Link>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!!pending}
                aria-label={"Unfollow " + id}
                title="Stop receiving email updates for this ontology."
                onClick={() => unfollow(id)}
              >
                {pending === id ? "Unfollowing…" : "Unfollow"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowedOntologies;
