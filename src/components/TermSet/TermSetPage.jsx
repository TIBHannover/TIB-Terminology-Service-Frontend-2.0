import { useState, useEffect } from "react";
import { getTermset } from "../../api/term_set";
import { useQuery } from "@tanstack/react-query";
import { RenderTermList } from "../Ontologies/TermList/RenderTermList";


const TermSetPage = (props) => {
  const termsetId = props.match.params.termsetId;

  const [termListForTable, setTermListForTable] = useState([]);

  const { termset, loading, error } = useQuery({
    queryKey: ["termset", termsetId],
    queryFn: () => getTermset(termsetId),
    enabled: !!termsetId
  });


  if (termset) {
    setTermListForTable(termset.terms);
  }


  if (loading) {
    return ("loadin ...")
  }
  if (error) {
    return ("error!")
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        {termset.name}
      </div>

    </div>
  );
}

export default TermSetPage;
