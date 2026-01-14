import { useState, useEffect } from "react";
import { fetchUserApiKeys, deleteApiKey } from "../../../api/user";
import { ApiKey } from "../../../api/types/userTypes";
import CreateApiKey from "./CreateApiKey";


const UserApiKey = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateApiKey, setShowCreateApiKey] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    fetchUserApiKeys().then(res => {
      setApiKeys(res);
    });
  }, []);

  useEffect(() => {
    if (showCreateApiKey) {
      return;
    }
    fetchUserApiKeys().then(res => {
      setApiKeys(res);
    });
  }, [showCreateApiKey, deleted]);


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
        {showCreateApiKey &&
          <>
            <button className="btn btn-secondary mb-2" onClick={() => setShowCreateApiKey(false)}>Back to list</button>
            <CreateApiKey />
          </>
        }
        {!showCreateApiKey &&
          <>
            <button className="btn btn-secondary mb-2" onClick={() => setShowCreateApiKey(true)}>Create new API key</button>
            <h5><b>Here you can see your API keys.</b></h5>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="col" className="col-1"></th>
                  <th scope="col" className="col-3">Title</th>
                  <th scope="col" className="col-3">name</th>
                  <th scope="col" className="col-5">Description</th>
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
                      <td scope="col" className="col-3">{key.title}</td>
                      <td scope="col" className="col-3">{key.name || "same as username"}</td>
                      <td scope="col" className="col-5">{key.description}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        }
      </div>
    </div>
  );
}

export default UserApiKey;
