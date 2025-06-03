import { useState, useEffect } from "react";
import { getTermset } from "../../api/term_set";
import { useQuery } from "@tanstack/react-query";
import TermTable from "../common/TermTable/TermTable";
import TermLib from "../../Libs/TermLib";


const TermSetPage = (props) => {
  const termsetId = props.match.params.termsetId;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [rowDataForTable, setRowDataForTable] = useState([]);
  const [tableColumns, _] = useState(
    [
      { id: "shortForm", text: "ID" },
      { id: "label", text: "Label" },
      { id: "decs", text: "Description" },
      { id: "altTerm", text: "Alternative Term" },
      //{ id: "subclass", text: "SubClass Of" },
      //{ id: "eqto", text: "Equivalent to" },
      { id: "example", text: "Example of usage" },
      { id: "seealso", text: "See Also" },
      { id: "contrib", text: "Contributor" },
      { id: "comment", text: "Comment" },
    ]);

  const { data, loading, error } = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId),
  });

  function createTermListForTable(listOfterms) {
    let baseUrl = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/';
    let dataForTable = [];
    for (let termWrapper of listOfterms) {
      let term = termWrapper.json;
      let termTreeUrl = baseUrl + encodeURIComponent(term['ontologyId']) + '/terms?iri=' + encodeURIComponent(term['iri']);
      let annotation = TermLib.getAnnotations(term);
      term["annotation"] = annotation;
      let termMap = new Map();
      termMap.set("shortForm", { value: term["shortForm"], valueLink: "" });
      termMap.set("label", { value: term["label"], valueLink: termTreeUrl });
      termMap.set("decs", { value: TermLib.createTermDiscription(term) ?? annotation?.definition, valueLink: "" });
      termMap.set("altTerm", { value: annotation['alternative label'] ? annotation['alternative label'] : "N/A", valueLink: "" });
      //termMap.set("subclass", { value: term.subClassOf, valueLink: "", valueIsHtml: true });
      //termMap.set("eqto", { value: term.eqAxiom, valueLink: "", valueIsHtml: true });
      termMap.set("example", { value: annotation['example of usage'] ? annotation['example of usage'] : "N/A", valueLink: "" });
      termMap.set("seealso", { value: annotation['seeAlso'] ? annotation['seeAlso'] : "N/A", valueLink: "" });
      termMap.set("contrib", { value: TermLib.getContributors(term), valueLink: "" });
      termMap.set("comment", { value: annotation['comment'] ? annotation['comment'] : "N/A", valueLink: "" });

      dataForTable.push(termMap);
    }
    setRowDataForTable(dataForTable);
    //props.setTableIsLoading(false);
  }


  useEffect(() => {
    if (dataLoaded) {
      return;
    }
    if (data) {
      setDataLoaded(true);
      createTermListForTable(data.terms);
    }
  }, [data]);


  if (error) {
    return ("error!")
  }

  return (
    <div className="justify-content-center ontology-page-container">
      <div className="tree-view-container list-container">
        <div className="row class-list-tablle-holder">
          <TermTable
            columns={tableColumns}
            terms={rowDataForTable}
            tableIsLoading={loading}
            setTableIsLoading={() => { }}
          />
        </div>
      </div>
    </div>
  );
}

export default TermSetPage;
