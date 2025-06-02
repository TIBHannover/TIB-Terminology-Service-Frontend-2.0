import { useState, useEffect, ReactNode } from "react";


type Column = {
  id: string,
  text: string,
}

type Term = {
  value: string,
  valueLink: string
}

type InputProp = {
  columns: Column[],
  terms: Map<string, Term>[], // id of this map is the id field in the Column
  tableIsLoading: boolean
}


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
              <th scope="col" className="table-header-cell">
                {col.text}
                <a onClick={() => { }} data-value={col.id}>
                  <i className="fa fa-eye-slash hidden-fa stour-class-list-hide-column-icon"></i>
                </a>
              </th>
            )
          })

          }
        </tr>
      </thead>
    ];
  }


  function createTableBody() {
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
              <a className="table-list-label-anchor" href={term.get(col.id)!.valueLink} target="_blank">
                {term.get(col.id)!.value}
              </a>
            </td>
          )
        } else {
          oneRow.push(
            <td className="table-body-cell"><span dangerouslySetInnerHTML={{ __html: term.get(col.id)!.value }} /></td>
          );
        }
      }
      tableRows.push(<tr>{oneRow}</tr>);
    }

    return tableRows;
  }


  function createShowColumnsTags() {
    return [
      <span>
        {columns.map((col) => {
          if (colVis.get(col.id)) {
            return;
          }
          return (
            <div className="show-hidden-column" onClick={() => { }} data-value={col.id}>{col.text} <i className="fa fa-eye"></i></div>
          )
        })
        }
      </span>
    ];
  }


  useEffect(() => {
    const visMap: Map<string, boolean> = new Map();
    for (let col of columns) {
      visMap.set(col.id, true);
    }
    setColVis(visMap);
  }, []);

  useEffect(() => {
    setTableBody(createTableBody());
  }, [terms]);



  return (
    <table className="table table-striped term-list-table term-table" id="class-list-table">
      {createShowColumnsTags()}
      {createTableHeader()}
      <tbody>
        {tableIsLoading && <div className="is-loading-term-list isLoading"></div>}
        {tableBody}
      </tbody>
    </table>
  );
}


export default TermTable;
