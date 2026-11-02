import { FormEvent, useContext, useEffect, useState } from "react";
import { fetchUserEmail, saveUserEmail, deleteUserEmail } from "../../../api/user";
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../../common/Alerts/Alerts";

const NotificationEmail = () => {
  const { user } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSavedEmail(null);
    setEmail("");
    setError("");
    setMessage("");
    fetchUserEmail()
      .then((address) => {
        if (active) {
          setEmail(address);
          setSavedEmail(address);
        }
      })
      .catch(() => {
        if (active) setError("Could not load your email. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user, reload]);

  async function updateEmail(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const address = event ? await saveUserEmail(email.trim()) : await deleteUserEmail();
      setEmail(address);
      setSavedEmail(address);
      setMessage(event ? "Notification email saved." : "Notification email removed.");
    } catch {
      setError("Could not update your email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="notification-email-heading" className="mt-4">
      <h2 id="notification-email-heading" className="h5">Notification email</h2>
      <p>
        Receive email when an ontology you follow gets a new non-private note,
        issue or term request, or publication. Private notes never trigger emails.
        Removing your email stops emails and keeps your follows.
      </p>
      {error && <AlertBox type="danger" message={error} />}
      <div role="status" aria-live="polite">{message}</div>
      {loading && <p role="status">Loading email…</p>}
      {!loading && savedEmail === null && (
        <button type="button" className="btn btn-secondary" onClick={() => setReload(reload + 1)}>
          Retry loading email
        </button>
      )}
      <form onSubmit={updateEmail}>
        <label htmlFor="notification-email" className="form-label">Email address</label>
        <input
          id="notification-email"
          type="email"
          autoComplete="email"
          className="form-control"
          maxLength={254}
          required
          value={email}
          disabled={loading || busy || savedEmail === null}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="d-flex flex-wrap gap-2 mt-3">
          <button type="submit" className="btn btn-secondary" disabled={loading || busy || savedEmail === null || !email.trim()}>
            {busy ? "Saving…" : savedEmail ? "Update email" : "Add email"}
          </button>
          {savedEmail && (
            <button type="button" className="btn btn-outline-danger" disabled={busy || loading} onClick={() => updateEmail()}>
              Remove email
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default NotificationEmail;
