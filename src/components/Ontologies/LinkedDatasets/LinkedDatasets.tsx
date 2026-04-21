import Table from 'react-bootstrap/Table';
import {useState, useEffect, useContext} from "react";
import {getDatasetLinks} from "../../../api/dataset_links";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {DatasetLink} from "../../../api/types/datasetLinks";
import {ErrorObject} from "../../../api/types/common";
import DropDown from "../../common/DropDown/DropDown";
import {DropDownOption} from "../../common/DropDown/DropDown";
import Pagination from "../../common/Pagination/Pagination";

const LinkedDatasets = () => {
    /*
    * ToDos:
    * - pagination
    * - filter by dataset title
    * - filter by dataset curie
    * - filter by repo name
    * - resolve term/prop/indiv pages via curie (if curie given then call api to get iri)
    * - metadata widget?
    * */
    const ontologyPageContext = useContext(OntologyPageContext);

    const DEFAULT_PAGE_SIZE = 20;
    const DEFAULT_GROUP_BY = "dataset";

    const [datasetLinksMap, setDatasetLinksMap] = useState<Map<string, DatasetLink[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
    const [datasetRepos, setDatasetRepos] = useState<DropDownOption[]>([]);


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
                            <a href={targetHref + encodeURIComponent(dl.curie!)} target="_blank"
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
        console.log("ontologyId", ontologyId);
        if (ontologyId === "nmrcv") {
            ontologyId = "nmr";
        }
        getDatasetLinks({ontologyId: ontologyId}).then((dlsMap: Map<string, DatasetLink[]> | ErrorObject) => {
            if ("value" in dlsMap) {
                setError(true);
                return;
            }
            let reposOptions: DropDownOption[] = [];
            let repoTitles: string[] = [];
            repoTitles = [...dlsMap.values()].flat().map((obj: DatasetLink) => obj.repo_name) as string[];
            let id = 1;
            reposOptions.push({value: 0, label: "All"});
            for (let title of new Set(repoTitles)) {
                reposOptions.push({value: id++, label: title});
            }
            setDatasetRepos(reposOptions);
            setDatasetLinksMap(dlsMap);
            setLoading(false);
        });
    }, []);


    return (
        <div className="row">
            <div className="col-sm-12">
                <h1>LinkedDatasets</h1>
                <div className="row mb-3 mt-3">
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={DEFAULT_GROUP_BY}
                            options={[{value: DEFAULT_GROUP_BY, label: "Dataset"}, {value: "2", label: "Term"}]}
                            dropDownId="dataset-links-group-by"
                            dropDownTitle="Group by"
                        />
                    </div>
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={0}
                            options={datasetRepos}
                            dropDownId="dataset-repos-filter"
                            dropDownTitle="Repository"
                        />
                    </div>
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={DEFAULT_PAGE_SIZE}
                            options={[{value: DEFAULT_PAGE_SIZE, label: DEFAULT_PAGE_SIZE}, {value: "2", label: "30"}, {
                                value: "3",
                                label: "40"
                            }]}
                            dropDownId="dataset-links-page-size"
                            dropDownTitle="Page size"
                        />
                    </div>
                    <div className="col-sm-3">
                        <Pagination
                            clickHandler={(newPage: number) => {
                                setPage(newPage);
                            }}
                            count={datasetLinksMap.size}
                            initialPageNumber={1}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <b>{`Showing ${(page - 1) * size + 1} - ${page * size} out of ${datasetLinksMap.size} dataset links.`}</b>
                    </div>
                </div>
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

        </div>
    );
}

export default LinkedDatasets;
