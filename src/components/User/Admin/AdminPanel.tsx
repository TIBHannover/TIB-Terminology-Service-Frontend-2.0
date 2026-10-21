import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { sendTestEmail } from "../../../api/admin";
import AlertBox from "../../common/Alerts/Alerts";
import "../../layout/userPanel.css";

const AdminPanel = () => {
  const appContext = useContext(AppContext);
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<boolean | null>(null);

  async function handleTestEmail() {
    if (sending) return;
    setSending(true);
    setEmailResult(null);
    setEmailResult(await sendTestEmail());
    setSending(false);
  }

  if (!appContext.user || !appContext.isUserSystemAdmin) {
    return null;
  }

  return (
    <section className="user-info-panel" aria-labelledby="admin-panel-heading">
      <h2 id="admin-panel-heading">Admin panel</h2>
      <p>Send a test email to the email address configured in your system admin role.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleTestEmail}
        disabled={sending}
      >
        {sending ? "Queueing test email…" : "Send test email"}
      </button>
      <div className="mt-3" role="status" aria-live="polite">
        {emailResult !== null && (
          <AlertBox
            type={emailResult ? "success" : "danger"}
            message={emailResult
              ? "Test email queued. Check the email address configured in your admin role."
              : "Could not queue the test email. Check your admin role email address and try again."}
          />
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
