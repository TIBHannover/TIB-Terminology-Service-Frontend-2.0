import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { unfollowOntologyFromEmail } from "../../../api/ontologyFollow";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import Header from "../../common/Header/Header";
import Footer from "../../common/Footer/Footer";

const OntologyUnfollow = () => {
  const [link] = useState(() => CommonUrlFactory.getOntologyUnfollowData());
  const [ontologyId, setOntologyId] = useState(link.ontologyId);
  const [busy, setBusy] = useState(false);
  const [unfollowed, setUnfollowed] = useState(false);
  const [error, setError] = useState("");

  async function unfollow() {
    setBusy(true);
    setError("");
    try {
      setOntologyId(await unfollowOntologyFromEmail(link.token));
      setUnfollowed(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not unfollow this ontology. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-fluid">
      <HelmetProvider><Helmet>
        <title>Unfollow ontology</title>
        <meta name="referrer" content="no-referrer" />
        <meta name="robots" content="noindex" />
      </Helmet></HelmetProvider>
      <Header minimal />
      <main className="application-content" aria-labelledby="ontology-unfollow-heading">
        <div className="card p-4 mx-auto my-4 col-12 col-md-8 col-lg-6">
          <h1 id="ontology-unfollow-heading" className="h3">{unfollowed ? `Unfollowed ${ontologyId}` : `Unfollow ${ontologyId || "ontology"}?`}</h1>
          {unfollowed ? (
            <p role="status">You will no longer receive updates for this ontology. You can follow it again on the Terminology Service.</p>
          ) : link.token ? (
            <>
              <p>This will stop all email updates for this ontology.</p>
              <button type="button" className="btn btn-secondary align-self-start fs-6" disabled={busy} onClick={unfollow}>
                {busy ? "Unfollowing…" : `Unfollow ${ontologyId || "ontology"}`}
              </button>
            </>
          ) : (
            <div role="alert" className="alert alert-warning">The unfollow link is missing. Use the link in your ontology update email.</div>
          )}
          {error && <div role="alert" className="alert alert-danger mt-3">{error}</div>}
          <Link className="mt-3 fs-6" to={CommonUrlFactory.getFollowedOntologiesUrl()}>Go to My Profile notifications</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OntologyUnfollow;
