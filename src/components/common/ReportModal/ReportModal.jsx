import { useState, useContext } from "react";
import AlertBox from "../Alerts/Alerts";
import { AppContext } from "../../../context/AppContext";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import Login from "../../User/Login/TS/Login";


export const ReportModalBtn = (props) => {

  const appContext = useContext(AppContext);

  return (
    <button type="button"
      className="btn btn-sm borderless-btn note-action-menu-btn"
      data-target={"#reportModal" + props.modalId}
      onClick={() => {
        if (appContext.user) {
          props.setShowModal(true);
        } else {
          props.setLoginModal(true);
          setTimeout(() => props.setLoginModal(false), 1000);
        }
      }}
    >
      Report
    </button>
  );
}


export const ReportModal = (props) => {

  const [submited, setSubmited] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const report = async () => {
    try {
      props.formData['content'] = document.getElementById("reportReason" + props.modalId).value;
      let postConfig = { method: 'POST', headers: props.callHeaders, body: JSON.stringify(props.formData), credentials: "include" };
      let result = await fetch(props.reportEndpoint, postConfig);
      setSubmited(true);
      setReportSuccess(result.ok)
    } catch (e) {
      setSubmited(true);
      setReportSuccess(false);
    }
  }


  return (
    <div>
      <ReportModalBtn modalId={props.modalId} setShowModal={setShowModal} setLoginModal={setLoginModal} />
      <Login isModal={true} showModal={loginModal} withoutButton={true} />
      <Modal show={showModal} id={"reportModal" + props.modalId}>
        <Modal.Header className="row">
          <div className="col-sm-6">
            <h5 className="modal-title" id={"reportModalLabel" + props.modalId}>Report Content</h5>
          </div>
          <div className="col-sm-6 text-end">
            {!submited &&
              <button type="button" className="close close-btn-message-modal" onClick={() => setShowModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            }
          </div>
        </Modal.Header>
        <Modal.Body>
          {!submited &&
            <>
              <div className="mb-3">
                <label htmlFor={"reportReason" + props.modalId} className="form-label">Please describe briefly the
                  reason for this report</label>
                <textarea className="form-control" id={"reportReason" + props.modalId} rows="3"></textarea>
              </div>
              <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse?section=3"}>Terms of
                Use</Link>
            </>
          }
          {submited && reportSuccess &&
            <AlertBox
              type="success"
              message="Thank you for the Report! We will examine it as soon as possible."
              alertColumnclassName="col-sm-12"
            />
          }
          {submited && !reportSuccess &&
            <AlertBox
              type="danger"
              message="Something went wrong. Please try again!"
              alertColumnclassName="col-sm-12"
            />
          }
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {!submited && <button type="button" className="btn btn-secondary" onClick={report}>Submit</button>}
          {submited &&
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>}
        </Modal.Footer>
      </Modal>
    </div>
  );

}


export default ReportModalBtn;


