import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFollowedOntologies, setOntologyFollow, updateOntologyFollow } from "../../../api/ontologyFollow";
import { OntologyFollow, OntologyFollowPreferences, followPreferenceOptions } from "../../../concepts/ontologyFollow";
import { AppContext } from "../../../context/AppContext";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import { useQuery } from "@tanstack/react-query";
import OntologyApi from "../../../api/ontology";
import AlertBox from "../../common/Alerts/Alerts";

const FollowedOntologies = () => {
  const { user } = useContext(AppContext);
  const [follows, setFollows] = useState<OntologyFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const ontologyListQuery = useQuery(["followedOntologyMetadata"], async () => {
    const result = await new OntologyApi({}).fetchOntologyListResult();
    if (result.failed) throw new Error("Could not load ontology metadata.");
    return result.ontologies;
  }, { staleTime: 0 });
  const repositories = Object.fromEntries((ontologyListQuery.data ?? []).map((ontology) => [ontology.ontologyId, ontology.githubRepository]));

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoaded(false);
    setFollows([]);
    setError("");
    setMessage("");
    fetchFollowedOntologies()
      .then((items) => {
        if (active) {
          setFollows(items);
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
      setFollows((items) => items.filter((follow) => follow.ontologyId !== ontologyId));
      setMessage("Ontology unfollowed.");
    } catch {
      setError("Could not unfollow this ontology. Please try again.");
    } finally {
      setPending("");
    }
  }

  async function updatePreference(ontologyId: string, key: keyof OntologyFollowPreferences, checked: boolean) {
    setPending(ontologyId);
    setError("");
    setMessage("");
    try {
      await updateOntologyFollow(ontologyId, { [key]: checked });
      setFollows((items) => items.map((follow) => follow.ontologyId === ontologyId ? { ...follow, [key]: checked } : follow));
      setMessage("Notification preferences saved.");
    } catch {
      setError("Could not save notification preferences. Please try again.");
    } finally {
      setPending("");
    }
  }

  function preferenceTargets(key: keyof OntologyFollowPreferences, checked: boolean) {
    return follows.filter((follow) => follow[key] !== checked && (!checked || key !== "notifyGithub" || repositories[follow.ontologyId]));
  }

  async function updateColumn(key: keyof OntologyFollowPreferences, checked: boolean) {
    setPending("all");
    setError("");
    setMessage("");
    const results = await Promise.allSettled(preferenceTargets(key, checked).map(async (follow) => {
      await updateOntologyFollow(follow.ontologyId, { [key]: checked });
      setFollows((items) => items.map((item) => item.ontologyId === follow.ontologyId ? { ...item, [key]: checked } : item));
    }));
    const failed = results.filter((result) => result.status === "rejected").length;
    if (failed) {
      setError(`Could not save notification preferences for ${failed} ontologies. Please try again.`);
    } else {
      setMessage("Notification preferences saved.");
    }
    setPending("");
  }

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="h5">Ontologies</h2>
        <p>
          Choose which emails you receive for each ontology.
        </p>
        {ontologyListQuery.isError && <AlertBox type="danger" withoutWrapper role="alert" message={<>
          Could not load ontology metadata. Existing GitHub subscriptions can still be disabled.
          <button type="button" className="btn btn-link btn-sm" onClick={() => ontologyListQuery.refetch()}>Retry metadata</button>
        </>} />}
        {error && <AlertBox type="danger" message={error} />}
        <div role="status" aria-live="polite">
          {message && <AlertBox type="success" message={message} />}
        </div>
        {loading && <p role="status">Loading followed ontologies…</p>}
        {!loading && !loaded && (
          <button type="button" className="btn btn-secondary" onClick={() => setReload(reload + 1)}>Retry</button>
        )}
        {!loading && loaded && follows.length === 0 && <p>You are not following any ontologies yet.</p>}
        {follows.length > 0 && <div className="table-responsive">
          <table className="table align-middle notification-preferences-table">
            <caption className="visually-hidden">Notification preferences for followed ontologies</caption>
            <thead><tr>
              <th scope="col">Ontology</th>
              {followPreferenceOptions.map(({ key, label }) => {
                const enabledCount = preferenceTargets(key, false).length;
                const remainingCount = preferenceTargets(key, true).length;
                return <th scope="col" key={key}>
                  {label}
                  <div className="mt-2">
                    <input type="checkbox" className="form-check-input" aria-label={`Toggle all ${label}`}
                      title={`Select to enable ${label} notifications for all eligible ontologies. Clear to disable them all. A dash means only some are enabled.`}
                      checked={enabledCount > 0 && remainingCount === 0}
                      ref={(input) => { if (input) input.indeterminate = enabledCount > 0 && remainingCount > 0; }}
                      disabled={!!pending || enabledCount + remainingCount === 0}
                      onChange={(event) => updateColumn(key, event.target.checked)} />
                  </div>
                </th>;
              })}
              <th scope="col">Actions</th>
            </tr></thead>
            <tbody>{follows.map((follow) => {
              const repository = repositories[follow.ontologyId] ?? (ontologyListQuery.isLoading ? undefined : ontologyListQuery.isError ? null : "");
              return (
              <tr key={follow.ontologyId}>
                <th scope="row"><Link className="text-break" to={CommonUrlFactory.getOntologyUrl(follow.ontologyId)}>{follow.ontologyId}</Link></th>
                {followPreferenceOptions.map(({ key, label }) => (
                  <td key={key}>
                    <input type="checkbox" className="form-check-input" checked={follow[key]} disabled={!!pending || (key === "notifyGithub" && !follow.notifyGithub && !repository)}
                      aria-label={`${label} for ${follow.ontologyId}`}
                      onChange={(event) => updatePreference(follow.ontologyId, key, event.target.checked)} />
                    {key === "notifyGithub" && !repository && (
                      <span className="small ms-2">{repository === undefined ? "Checking…" : repository === null ? "Check failed" : "Unavailable"}</span>
                    )}
                  </td>
                ))}
                <td><button type="button" className="btn btn-secondary btn-sm" disabled={!!pending}
                  aria-label={"Unfollow " + follow.ontologyId} title="Stop receiving email updates for this ontology."
                  onClick={() => unfollow(follow.ontologyId)}>Unfollow</button></td>
              </tr>
              );
            })}</tbody>
          </table>
        </div>}
      </div>
    </div>
  );
};

export default FollowedOntologies;
