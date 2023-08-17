import React from "react";


export const RowWithSingleColumn = (props) => {
    return (
        <div className={"row " + props.rowClass}>
            <div className={props.columnClass}>
                {props.content}
            </div>
        </div>
    );
}