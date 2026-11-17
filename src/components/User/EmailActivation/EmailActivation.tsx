import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { activateUserEmail } from "../../../api/user";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import Header from "../../common/Header/Header";
import Footer from "../../common/Footer/Footer";

const EmailActivation = () => {
  const [token] = useState(() => CommonUrlFactory.getEmailActivationToken());
  const [busy, setBusy] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState("");

  async function activate() {
    setBusy(true);
    setError("");
    try {
      await activateUserEmail(token);
      setActivated(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not activate your email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-fluid">
      <HelmetProvider><Helmet>
        <title>Activate email</title>
        <meta name="referrer" content="no-referrer" />
        <meta name="robots" content="noindex" />
      </Helmet></HelmetProvider>
      <Header minimal />
      <main className="application-content" aria-labelledby="email-activation-heading">
        <div className="card p-4 mx-auto my-4 col-12 col-md-8 col-lg-6">
          <h1 id="email-activation-heading" className="h3">{activated ? "Email activated" : "Confirm your email address"}</h1>
          {activated ? (
            <p role="status">Your email address is confirmed. You can now receive ontology notifications according to your preferences.</p>
          ) : token ? (
            <>
              <p>Activate your email address to receive ontology notifications. You will not receive notifications until you confirm your email.</p>
              <button type="button" className="btn btn-secondary align-self-start fs-6" disabled={busy} onClick={activate}>
                {busy ? "Activating…" : "Activate email"}
              </button>
            </>
          ) : (
            <div role="alert" className="alert alert-warning">The activation link is missing. Save your email under Notifications in My Profile to request a new link.</div>
          )}
          {error && <div role="alert" className="alert alert-danger mt-3">{error}</div>}
          <Link className="mt-3 fs-6" to={CommonUrlFactory.getProfileUrl("notifications")}>Go to My Profile notifications</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailActivation;
