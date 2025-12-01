import { useState, useEffect } from "react";
import { getAllTermsetList } from "../../api/term_set";
import { TsTermset } from "../../concepts";


const TermsetList = () => {
  const [termsets, setTermsets] = useState<TsTermset[]>([]);

  useEffect(() => {
    getAllTermsetList().then((termsets) => {
      setTermsets(termsets);
    });
  }, []);

  return (
    <>
      {termsets.map((termset) => {
        return (
          <div key={termset.id}>
            {termset.name}
          </div>
        );
      })}

    </>
  );
}

export default TermsetList;
