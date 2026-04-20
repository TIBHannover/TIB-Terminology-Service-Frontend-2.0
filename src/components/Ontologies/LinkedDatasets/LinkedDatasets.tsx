import Table from 'react-bootstrap/Table';
import {useState, useEffect, useContext} from "react";
import {getDatasetLinks} from "../../../api/dataset_links";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {DatasetLink} from "../../../api/types/datasetLinks";
import {ErrorObject} from "../../../api/types/common";

const LinkedDatasets = () => {
    const ontologyPageContext = useContext(OntologyPageContext);

    const [datasetLinksMap, setDatasetLinksMap] = useState<Map<string, DatasetLink[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);

    /*
    * ToDos:
    * - pagination
    * - filter by dataset title
    * - filter by dataset curie
    * - filter by repo name
    * - resolve term/prop/indiv pages via curie (if curie given then call api to get iri)
    * - metadata widget?
    * */

    function renderDatasetLinks() {
        if (datasetLinksMap.size === 0) {
            return <p>No dataset links found</p>
        }
        let results = [];
        for (let datasetTitle of Array.from(datasetLinksMap.keys()).slice((page - 1) * size, page * size)) {
            let dls = datasetLinksMap.get(datasetTitle)!;
            let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(ontologyPageContext.ontology.ontologyId) + "/terms?curie=";
            results.push(
                <tr>
                    <td>
                        <a href={`${process.env.REACT_APP_NFDI4CHEM_SEARCH_SERVICE_URL}${datasetTitle}`} target="_blank"
                           rel="noopener noreferrer">
                            {datasetTitle}
                        </a>
                    </td>
                    <td>
                        {dls.map((dl: DatasetLink) =>
                            <a href={targetHref + encodeURIComponent(dl.curie ?? "")} target="_blank"
                               rel="noopener noreferrer">
                                <span className="term-button">{dl.curie}</span>
                            </a>
                        )}
                    </td>
                </tr>
            );
        }
        return results;
    }


    useEffect(() => {
        let ontologyId = ontologyPageContext.ontology.ontologyId;
        getDatasetLinks({ontologyId: ontologyId}).then((dlsMap: Map<string, DatasetLink[]> | ErrorObject) => {
            if ("value" in dlsMap) {
                setError(true);
                return;
            }
            setDatasetLinksMap(dlsMap);
            setLoading(false);
        });
    }, []);


    return (
        <div>
            <h1>LinkedDatasets</h1>
            <Table striped bordered responsive>
                <thead>
                <tr>
                    <th>Dataset</th>
                    <th>Linked terms</th>
                </tr>
                </thead>
                <tbody>
                {!loading && !error && renderDatasetLinks()}
                </tbody>
            </Table>
        </div>
    );
}

export default LinkedDatasets;
