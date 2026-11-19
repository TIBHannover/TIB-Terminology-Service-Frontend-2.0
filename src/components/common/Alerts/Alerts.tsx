import { HTMLAttributes, ReactNode } from "react";

type AlertBoxProps = Pick<HTMLAttributes<HTMLDivElement>, "className" | "role" | "title"> & {
  message: ReactNode;
  alertColumnClass?: string;
  withoutWrapper?: boolean;
  type: "danger" | "success" | "warning" | "info";
};

type CopiedSuccessAlertProps = {
  message: string;
};

export const AlertBox = (props: AlertBoxProps) => {
  const alert = (
    <div role={props.role} title={props.title} className={"alert alert-" + props.type + (props.className ? " " + props.className : "")}>
      {props.message}
    </div>
  );
  if (props.withoutWrapper) return alert;

  return (
    <div className="row text-center">
      <div className={props.alertColumnClass}>
        {alert}
      </div>
    </div>
  );
};

export const CopiedSuccessAlert = (props: CopiedSuccessAlertProps) => {
  return (
    <div className="note-link-copy-message">
      <i className="fa fa-check" aria-hidden="true"></i>
      <small>{props.message}</small>
    </div>
  );
};

export default AlertBox;
