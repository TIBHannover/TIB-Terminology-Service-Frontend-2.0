import Table from 'react-bootstrap/Table';
import {useState, useEffect, useContext} from "react";
import {getDatasetLinks, getDatasetRepositories} from "../../../api/dataset_links";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {DatasetLink, GetDatasetLinkServiceResp} from "../../../api/types/datasetLinks";
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
    const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);
    const [datasetRepos, setDatasetRepos] = useState<DropDownOption[]>([]);
    const [groupBy, setGroupBy] = useState<string>(DEFAULT_GROUP_BY);
    const [selectedRepo, setSelectedRepo] = useState<number>(0);
    const [tableContent, setTableContent] = useState<JSX.Element[]>([]);
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [totalDatasetLinksCount, setTotalDatasetLinksCount] = useState<number>(0);

    const sizeOptions: DropDownOption[] = [{value: DEFAULT_PAGE_SIZE, label: DEFAULT_PAGE_SIZE}, {
        value: "30",
        label: "30"
    }, {value: "40", label: "40"}];
    const groupByOptions: DropDownOption[] = [{value: DEFAULT_GROUP_BY, label: "Dataset"}, {value: "2", label: "Term"}];


    function renderDatasetLinks() {
        let content = [];
        if (datasetLinksMap.size === 0) {
            content.push(<p>No dataset links found</p>);
        } else if (groupBy === DEFAULT_GROUP_BY) {
            content = [...renderByDataset()];
        } else {
            content = [...renderByTerm()];
        }
        setTableContent(content);
        setLoading(false);
        return true;
    }

    function renderDatasetTableEntry(datasetTitle: string) {
        return (
            <a href={`${process.env.REACT_APP_NFDI4CHEM_SEARCH_SERVICE_URL}/dataset/${datasetTitle}`} target="_blank"
               rel="noopener noreferrer">
                {datasetTitle}
            </a>
        );
    }

    function renderCurieTableEntry(curie: string) {
        if (curie.includes("_")) {
            curie = curie.replace("_", ":");
        }
        let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(ontologyPageContext.ontology.ontologyId) + "/terms?curie=";
        return (
            <a href={targetHref + encodeURIComponent(curie!)} target="_blank"
               rel="noopener noreferrer">
                <span className="term-button">{curie}</span>
            </a>
        );
    }

    function renderByDataset() {
        let results = [];
        for (let [datasetTitle, dls] of datasetLinksMap) {
            results.push(
                <tr>
                    <td className="col-6">{renderDatasetTableEntry(datasetTitle)}</td>
                    <td className="col-6">{dls.map((dl: DatasetLink) => renderCurieTableEntry(dl.curie!))}</td>
                </tr>
            );
        }
        return results;
    }

    function renderByTerm() {
        let results = [];
        for (let [curie, dls] of datasetLinksMap) {
            results.push(
                <tr>
                    <td className="col-6">{renderCurieTableEntry(curie)}</td>
                    <td className="col-6">
                        {dls.map((dl: DatasetLink) =>
                            <>
                                {renderDatasetTableEntry(dl.dataset_title!)}
                                <br/>
                            </>
                        )}
                    </td>
                </tr>
            )
        }
        return results;
    }

    function handleGroupByChange(e: React.ChangeEvent<HTMLSelectElement>) {
        let newGroupBy = e.target.value;
        setGroupBy(newGroupBy);
        setPage(1);
    }


    function filterByRepo(e: React.ChangeEvent<HTMLSelectElement>) {
        let repoId = parseInt(e.target.value);
        setSelectedRepo(repoId);
        setPage(1);
    }

    function fetchData() {
        let ontologyId = ontologyPageContext.ontology.ontologyId;
        if (ontologyId === "nmrcv") {
            ontologyId = "nmr";
        }
        let repo = datasetRepos.find((repo: DropDownOption) => repo.value === selectedRepo);
        getDatasetLinks({
            ontologyId: ontologyId,
            page: page,
            size: size,
            groupBy: groupBy === DEFAULT_GROUP_BY ? groupBy : "term",
            repository: repo?.value! > 0 ? repo?.label as string : undefined
        }).then((resp: GetDatasetLinkServiceResp | ErrorObject) => {
            if ("value" in resp) {
                setError(true);
                return;
            }
            let dlsMap = resp.linksMap;
            setDatasetLinksMap(dlsMap);
            setTotalDatasetLinksCount(resp.total);
            setDataIsReady(true);
        });
    }

    function loadDatasetRepositoriesOptions() {
        let reposOptions: DropDownOption[] = [];
        reposOptions.push({value: 0, label: "All"});
        let id = 1;
        for (let title of ontologyPageContext.repositories) {
            reposOptions.push({value: id++, label: title});
        }
        setDatasetRepos(reposOptions);
    }


    useEffect(() => {
        loadDatasetRepositoriesOptions();
        fetchData();
    }, []);


    useEffect(() => {
        setDatasetLinksMap(new Map());
        setDataIsReady(false);
        setLoading(true);
        fetchData();
    }, [page, size, groupBy, selectedRepo]);

    useEffect(() => {
        if (dataIsReady) {
            renderDatasetLinks();
        }
    }, [dataIsReady]);


    return (
        <div className="row">
            <div className="col-sm-12">
                <h1>LinkedDatasets</h1>
                <div className="row mb-3 mt-3">
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={DEFAULT_GROUP_BY}
                            options={groupByOptions}
                            dropDownId="dataset-links-group-by"
                            dropDownTitle="Group by"
                            dropDownChangeHandler={handleGroupByChange}
                        />
                    </div>
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={0}
                            options={datasetRepos}
                            dropDownId="dataset-repos-filter"
                            dropDownTitle="Repository"
                            dropDownChangeHandler={filterByRepo}
                        />
                    </div>
                    <div className="col-sm-3">
                        <DropDown
                            defaultValue={DEFAULT_PAGE_SIZE}
                            options={sizeOptions}
                            dropDownId="dataset-links-page-size"
                            dropDownTitle="Page size"
                            dropDownChangeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setSize(parseInt(e.target.value));
                                setPage(1);
                            }}
                        />
                    </div>
                    <div className="col-sm-3">
                        <Pagination
                            clickHandler={(newPage: number) => {
                                setPage(newPage);
                            }}
                            count={Math.ceil(totalDatasetLinksCount / size)}
                            initialPageNumber={1}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <b>
                            {`Showing 
                            ${(page - 1) * size + 1} - ${page * size < totalDatasetLinksCount ? page * size : totalDatasetLinksCount} 
                            out of ${totalDatasetLinksCount} 
                            ${groupBy === DEFAULT_GROUP_BY ? "datasets" : "terms"}.`}
                        </b>
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
                    {!loading && !error && tableContent}
                    {loading && <tr>
                      <td colSpan={2}>
                        <div className="isLoading"></div>
                      </td>
                    </tr>}
                    </tbody>
                </Table>
            </div>

        </div>
    );
}

export default LinkedDatasets;
