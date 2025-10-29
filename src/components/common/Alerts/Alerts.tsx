type AlertBoxProps = {
  message: string;
  alertColumnClass?: string;
  type: "danger" | "success" | "warning";
}

type CopiedSuccessAlertProps = {
  message: string;
}


export const AlertBox = (props: AlertBoxProps) => {
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


export const CopiedSuccessAlert = (props: CopiedSuccessAlertProps) => {
  return (
    <div className="note-link-copy-message">
      <i className="fa fa-check" aria-hidden="true"></i>
      <small>{props.message}</small>
    </div>
  );
}


export default AlertBox;