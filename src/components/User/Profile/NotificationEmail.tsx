import { FormEvent, useContext, useEffect, useState } from "react";
import { fetchUserEmail, saveUserEmail, deleteUserEmail } from "../../../api/user";
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../../common/Alerts/Alerts";

const NotificationEmail = () => {
  const { user } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSavedEmail(null);
    setEmailVerified(false);
    setEmail("");
    setError("");
    setMessage("");
    fetchUserEmail()
      .then((result) => {
        if (active) {
          setEmail(result.email);
          setSavedEmail(result.email);
          setEmailVerified(result.emailVerified);
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
      const result = event ? await saveUserEmail(email.trim()) : await deleteUserEmail();
      setEmail(result.email);
      setSavedEmail(result.email);
      setEmailVerified(result.emailVerified);
      setMessage(event
        ? result.emailVerified ? "Notification email saved." : "Confirmation email sent. Check your inbox and activate your email. You will not receive any ontology notifications until you confirm it."
        : "Notification email removed.");
    } catch {
      setError("Could not update your email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="notification-email-heading" className="mt-4">
      {savedEmail && !emailVerified && (
        <AlertBox type="warning" withoutWrapper role="alert" message="Your email address is not confirmed. Check your inbox and activate your email before you can receive any ontology notifications. Save your email again to request a new activation link." />
      )}
      <h2 id="notification-email-heading" className="h5">Email</h2>
      <p>
        Receive email when an ontology you follow gets a new non-private note,
        issue or term request, or publication. Private notes never trigger emails.
        You must confirm a new email address using the activation link sent to your inbox.
        Until then, you will not receive any ontology notifications.
        Removing your email stops emails and keeps your follows.
      </p>
      {error && <AlertBox type="danger" message={error} />}
      <div role="status" aria-live="polite">
        {message && <AlertBox type="success" withoutWrapper message={message} />}
      </div>
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
