import { useContext } from "react";
import type { MouseEvent } from "react";
import { AppContext } from "../../../context/AppContext";
import AlertBox from "../Alerts/Alerts";
import { sendResolveRequest } from "../../../api/report";

type ResolveReportActionsForAdminsProps = {
  objectType: string;
  objectId: string;
  reportStatus?: boolean;
  creatorUsername: string;
};

const ResolveReportActionsForAdmins = (
  props: ResolveReportActionsForAdminsProps,
) => {
  const appContext = useContext(AppContext);

  async function sendResolveCommand(e: MouseEvent<HTMLButtonElement>) {
    let resolveAction = e.currentTarget.value;
    let redirectAfterDeleteEndpoint = window.location.href;
    let locationObject = window.location;
    let searchParams = new URLSearchParams(window.location.search);
    if (redirectAfterDeleteEndpoint.includes("noteId=")) {
      // we are on the note page
      searchParams.delete("noteId");
    }
    redirectAfterDeleteEndpoint =
      locationObject.pathname + "?" + searchParams.toString();
    let resolveStatus = await sendResolveRequest({
      objectType: props.objectType,
      objectId: props.objectId,
      action: resolveAction,
      creatorUsername: props.creatorUsername,
    });
    if (resolveStatus) {
      window.location.replace(redirectAfterDeleteEndpoint);
    }
  }

  if (!appContext.isUserSystemAdmin || !props.reportStatus) {
    return null;
  }

  return (
    <>
      <AlertBox
        type="danger"
        message="Attention! This Content is Reported and needs action!"
      />
      <div className="row">
        <div className="col-sm-12">
          <button
            className="btn btn-danger mr-2"
            value="delete"
            onClick={sendResolveCommand}
          >
            delete
          </button>
          <button
            className="btn btn-danger mr-2"
            value="delete-block"
            onClick={sendResolveCommand}
          >
            delete And block user
          </button>
          <button
            className="btn btn-success"
            value="none"
            onClick={sendResolveCommand}
          >
            False Report
          </button>
        </div>
      </div>
      <br></br>
    </>
  );
};

export default ResolveReportActionsForAdmins;
