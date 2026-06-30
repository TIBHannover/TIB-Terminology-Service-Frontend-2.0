import { useState, useEffect, ReactNode } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Toolkit from "../../../Libs/Toolkit";

type Column = {
  id: string;
  text: string;
  defaultVisible?: boolean;
};

type Term = {
  value: string;
  valueLink: string;
  valueIsHtml: boolean; // value is html and is rendered through Toolkit
};

type InputProp = {
  columns: Column[];
  terms: Map<string, Term>[]; // !Attention!: id of this map has to be the id field in the Column
  tableIsLoading: boolean; // get the loading status from the parent component who provides the data
  setTableIsLoading: (isLoading: boolean) => void; // set the table is loading when an event is triggered inside the table
  controlsBeforeColumnVisibility?: ReactNode;
  controlsAfterColumnTags?: ReactNode;
  isInRotatedContainer?: boolean;
};

const TermTable = (props: InputProp) => {
  const { columns, terms, tableIsLoading } = props;

  const [colVis, setColVis] = useState<Map<string, boolean>>(new Map());
  const [tableBody, setTableBody] = useState<ReactNode[]>([]);

  function createTableHeader() {
    return [
      <thead>
        <tr>
          {columns.map((col) => {
            if (!colVis.get(col.id)) {
              return;
            }
            return (
              <th
                scope="col"
                className={
                  col.id !== "action"
                    ? "table-header-cell"
                    : "table-header-cell-small"
                }
              >
                {col.text}
                {col.id !== "action" && (
                  <div
                    onClick={showHideTableColumn}
                    data-value={col.id}
                    className="eye-icon"
                  >
                    <i className="fa fa-eye-slash hidden-fa stour-class-list-hide-column-icon"></i>
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      </thead>,
    ];
  }

  function createTableBody() {
    if (!terms.length) {
      return [<></>];
    }
    let tableRows = [];
    let oneRow = [];

    for (let term of terms) {
      oneRow = [];
      for (let col of columns) {
        if (!colVis.get(col.id)) {
          continue;
        }
        if (term.get(col.id)!.valueLink) {
          oneRow.push(
            <td className="label-col table-body-cell">
              <a
                className="table-list-label-anchor"
                href={term.get(col.id)!.valueLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {term.get(col.id)!.value}
              </a>
            </td>,
          );
        } else if (term.get(col.id)!.valueIsHtml) {
          oneRow.push(
            <td className="table-body-cell">
              {Toolkit.renderDangerousHtml(term.get(col.id)!.value, {}, "span")}
            </td>,
          );
        } else {
          oneRow.push(
            <td
              className={
                col.id !== "action"
                  ? "table-body-cell"
                  : "table-body-cell-small"
              }
            >
              {term.get(col.id)!.value}
            </td>,
          );
        }
      }
      tableRows.push(<tr>{oneRow}</tr>);
    }

    return tableRows;
  }

  function createColumnVisibilityDropdown() {
    return [
      <Dropdown autoClose="outside" className="term-table-column-dropdown">
        <Dropdown.Toggle variant="secondary" id="term-table-column-visibility">
          Column visibility
        </Dropdown.Toggle>
        <Dropdown.Menu className="term-table-column-menu">
          {columns.map((col) => {
            if (col.id === "action") {
              return;
            }
            return (
              <label className="dropdown-item" htmlFor={"column-" + col.id}>
                <input
                  type="checkbox"
                  id={"column-" + col.id}
                  className="form-check-input me-2"
                  checked={colVis.get(col.id) ?? false}
                  onChange={showHideTableColumn}
                  data-value={col.id}
                />
                {col.text}
              </label>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>,
    ];
  }

  function createTableControls() {
    if (!props.controlsBeforeColumnVisibility && !props.controlsAfterColumnTags) {
      return createColumnVisibilityDropdown();
    }
    return [
      <div className="row term-table-toolbar align-items-center g-2">
        {props.controlsBeforeColumnVisibility}
        <div className="col-sm-3">
          {createColumnVisibilityDropdown()}
        </div>
        {props.controlsAfterColumnTags}
      </div>,
    ];
  }

  function showHideTableColumn(
    e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) {
    try {
      props.setTableIsLoading(true);
      let colId = e.currentTarget.dataset?.value;
      if (!colId) {
        props.setTableIsLoading(false);
        return true;
      }
      let columnVisibilityCopy = new Map(colVis);
      columnVisibilityCopy.set(colId, !columnVisibilityCopy.get(colId));
      setColVis(columnVisibilityCopy);
      props.setTableIsLoading(false);
    } catch (e) {
      props.setTableIsLoading(false);
      return true;
    }
  }

  useEffect(() => {
    if (!columns) {
      return;
    }
    const visMap: Map<string, boolean> = new Map();
    for (let col of columns) {
      visMap.set(col.id, col.defaultVisible ?? true);
    }
    setColVis(visMap);
    setTableBody(createTableBody());
  }, [columns]);

  useEffect(() => {
    setTableBody(createTableBody());
  }, [terms, colVis]);

  const table = (
    <table
      className="table table-striped term-list-table term-table"
      id="class-list-table"
    >
      {columns && createTableHeader()}
      <tbody>
        {tableIsLoading && (
          <div className="is-loading-term-list isLoading"></div>
        )}
        {!tableIsLoading && columns && tableBody}
      </tbody>
    </table>
  );

  if (props.isInRotatedContainer) {
    return (
      <>
        {table}
        {columns && createTableControls()}
      </>
    );
  }

  return (
    <>
      {columns && createTableControls()}
      {table}
    </>
  );
};

export default TermTable;
