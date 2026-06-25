import type { ReactNode } from "react";

type RowWithSingleColumnProps = {
  rowClass?: string;
  rowclassName?: string;
  columnClass?: string;
  columnclassName?: string;
  content: ReactNode;
};

export const RowWithSingleColumn = (props: RowWithSingleColumnProps) => {
  const rowClass = props.rowClass ?? props.rowclassName ?? "";
  const columnClass = props.columnClass ?? props.columnclassName ?? "";
  return (
    <div className={"row " + rowClass}>
      <div className={columnClass}>{props.content}</div>
    </div>
  );
};
