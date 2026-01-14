import { useState, useEffect } from "react";
import { fetchUserApiKeys } from "../../../api/user";
import { ApiKey } from "../../../api/types/userTypes";
import CreateApiKey from "./CreateApiKey";


const UserApiKey = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateApiKey, setShowCreateApiKey] = useState(false);

  useEffect(() => {
    fetchUserApiKeys().then(res => {
      setApiKeys(res);
    });
  }, []);



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
                  <th scope="col" className="col-3">Title</th>
                  <th scope="col" className="col-5">Description</th>
                  <th scope="col" className="col-2">name</th>
                  <th scope="col" className="col-2">expires_at</th>
                </tr>
                {apiKeys.map((key: ApiKey) => {
                  return (
                    <tr>
                      <td scope="col" className="col-6">{key.title}</td>
                      <td scope="col" className="col-2">{key.description}</td>
                      <td scope="col" className="col-2">{key.name || "same as username"}</td>
                      <td scope="col" className="col-2">{key.expires_at}</td>
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
