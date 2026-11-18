import { useState, useEffect } from "react";
import { fetchUserApiKeys, deleteApiKey } from "../../../api/user";
import { ApiKey } from "../../../api/types/userTypes";
import CreateApiKey from "./CreateApiKey";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import AlertBox from "../../common/Alerts/Alerts";

const UserApiKey = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [showCreateApiKey, setShowCreateApiKey] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (showCreateApiKey) {
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    fetchUserApiKeys().then((res) => {
      if (active) {
        setApiKeys(res);
      }
    }).catch(() => {
      if (active) setError("Could not load API keys. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [showCreateApiKey, deleted, reload]);

  function deleteKey(e: React.MouseEvent<HTMLElement>) {
    let id = e.currentTarget.dataset.id;
    if (!id) {
      return;
    }
    deleteApiKey(id).then((result) => {
      if (result) {
        setDeleted(true);
        setTimeout(() => {
          setDeleted(false);
        }, 1000);
      }
    });
  }

  return (
    <div className="row user-info-panel">
      <div className="col-sm-12">
        <p>
          The TS Plugin API lets you access Terminology Service features such as notes, ontology collections, and termsets from your own scripts or applications.
          {" "}Use an API key to authenticate your requests. Explore the available endpoints and try them in the <a href={CommonUrlFactory.getSwaggerUrl()} target="_blank" rel="noopener noreferrer">Swagger API documentation</a>.
        </p>
        {showCreateApiKey && (
          <>
            <button
              className="btn btn-secondary mb-2"
              onClick={() => { setLoading(true); setShowCreateApiKey(false); }}
            >
              Back to list
            </button>
            <CreateApiKey />
          </>
        )}
        {!showCreateApiKey && loading && <p role="status">Loading API keys…</p>}
        {!showCreateApiKey && error && <AlertBox type="danger" withoutWrapper role="alert" message={<>
          {error} <button type="button" className="btn btn-link btn-sm" onClick={() => setReload(reload + 1)}>Retry loading API keys</button>
        </>} />}
        {!showCreateApiKey && !loading && !error && (
          <>
            {apiKeys.length === 0 ? (
              <AlertBox type="info" withoutWrapper role="alert" className="d-flex flex-wrap align-items-center gap-2" message={<>
                <span>You have no API keys yet. Create a new key to access the API.</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCreateApiKey(true)}>
                  Create new API key
                </button>
              </>} />
            ) : <button
              className="btn btn-secondary btn-sm mb-2"
              onClick={() => setShowCreateApiKey(true)}
            >
              Create new API key
            </button>}
            {apiKeys.length > 0 && <h5>
              <b>Here you can see your API keys.</b>
            </h5>}
            {apiKeys.length > 0 && <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="col" className="col-1"></th>
                  <th scope="col" className="col-3">
                    Title
                  </th>
                  <th scope="col" className="col-3">
                    name
                  </th>
                  <th scope="col" className="col-5">
                    Description
                  </th>
                </tr>
                {apiKeys.map((key: ApiKey) => {
                  return (
                    <tr>
                      <td scope="col" className="col-1">
                        <i
                          className="bi bi-file-minus-fill"
                          title="remove this key"
                          data-id={key.id}
                          onClick={deleteKey}
                        />
                      </td>
                      <td scope="col" className="col-3">
                        {key.title}
                      </td>
                      <td scope="col" className="col-3">
                        {key.name || "same as username"}
                      </td>
                      <td scope="col" className="col-5">
                        {key.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>}
          </>
        )}
      </div>
    </div>
  );
};

export default UserApiKey;
