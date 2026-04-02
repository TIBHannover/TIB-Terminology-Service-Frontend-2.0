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

    function renderDatasetLinks() {
        if (datasetLinksMap.size === 0) {
            return <p>No dataset links found</p>
        }
        let results = [];
        for (let [datasetTitle, dls] of datasetLinksMap) {
            results.push(
                <tr>
                    <td>
                        <a href={`${process.env.REACT_APP_NFDI4CHEM_SEARCH_SERVICE_URL}${datasetTitle}`} target="_blank"
                           rel="noopener noreferrer">
                            {datasetTitle}
                        </a>
                    </td>
                    <td>{dls.map((dl: DatasetLink) => `${dl.curie}  `)}</td>
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
            <Table striped bordered>
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
