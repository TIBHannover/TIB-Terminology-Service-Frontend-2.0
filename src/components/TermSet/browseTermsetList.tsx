
import "../layout/termset.css";
import TermsetList from "./TermsetList";
import { getAllTermsetList } from "../../api/term_set";
import { useEffect, useState } from "react";
import { TsTermset } from "../../concepts";


const BrowseTermSetList = () => {

  const [termsets, setTermsets] = useState<TsTermset[]>([]);

  useEffect(() => {
    getAllTermsetList().then((result) => {
      setTermsets(result);
    });
  }, []);

  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return "";
  }

  return (
    <>
      <p className="fs-2 fw-bold">Browse termsets</p>
      <TermsetList
        termsets={termsets}
        redirectAfterDeleteEndpoint={"/termsets"}
        backBtnText="termset list"
        from={"browse"}
      />
    </>
  )
}

export default BrowseTermSetList;
