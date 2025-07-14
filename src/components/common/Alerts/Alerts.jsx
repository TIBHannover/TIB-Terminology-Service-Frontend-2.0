export const AlertBox = (props) => {
  return (
    <div className="row text-center">
      <div className={props.alertColumnClass}>
        <div className={"alert alert-" + props.type}>
          {props.message}
        </div>
      </div>
    </div>
  );
}


export const CopiedSuccessAlert = (props) => {
  return (
    <div className="note-link-copy-message">
      <i className="fa fa-check" aria-hidden="true"></i>
      <small>{props.message}</small>
    </div>
  );
}


export default AlertBox;