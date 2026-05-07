import Table from 'react-bootstrap/Table';
import {useState, useEffect, useContext} from "react";
import {getDatasetLinks, getDatasetRepositories} from "../../../api/dataset_links";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {DatasetLink, GetDatasetLinkServiceResp} from "../../../api/types/datasetLinks";
import {ErrorObject} from "../../../api/types/common";
import DropDown from "../../common/DropDown/DropDown";
import {DropDownOption} from "../../common/DropDown/DropDown";
import Pagination from "../../common/Pagination/Pagination";
import AlertBox from "../../common/Alerts/Alerts";
import TruncatedText from "../../common/TruncatedText/TruncatedText";
import CommonUrlFactory from "../../../UrlFactory/CommonUrlFactory";
import * as SiteUrlParamNames from '../../../UrlFactory/UrlParamNames';

type CmpProps = {
    inputCurie?: string;
}

const LinkedDatasets = (props: CmpProps) => {
    /*
    Issue: some curies stored by search service are wrong (term ids) like CHMO_0002345 vs CHMO:0002345
    * ToDos:
    * - filter by dataset title
    * - filter by dataset curie
    * - metadata widget?
    * */

    const {inputCurie} = props;
    const urlFactory = new CommonUrlFactory();
    const ontologyPageContext = useContext(OntologyPageContext);
    const DEFAULT_PAGE_SIZE = 20;
    const DEFAULT_GROUP_BY = "dataset";

    let groupByFromUrl = urlFactory.getParam({name: SiteUrlParamNames.GroupBy});
    groupByFromUrl = groupByFromUrl && ["term", DEFAULT_GROUP_BY].includes(groupByFromUrl) ? groupByFromUrl : DEFAULT_GROUP_BY;
    let sizeFromUrl = urlFactory.getParam({name: SiteUrlParamNames.Size}) ?? DEFAULT_PAGE_SIZE;
    let pageFromUrl = urlFactory.getParam({name: SiteUrlParamNames.Page}) ?? 1;
    let repositoryFromUrl = urlFactory.getParam({name: SiteUrlParamNames.Repository});

    const [datasetLinksMap, setDatasetLinksMap] = useState<Map<string, DatasetLink[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(parseInt(pageFromUrl as string));
    const [size, setSize] = useState<number>(parseInt(sizeFromUrl as string));
    const [datasetRepos, setDatasetRepos] = useState<DropDownOption[]>([]);
    const [groupBy, setGroupBy] = useState<string>(groupByFromUrl);
    const [selectedRepo, setSelectedRepo] = useState<number>(0);
    const [tableContent, setTableContent] = useState<JSX.Element[]>([]);
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [totalDatasetLinksCount, setTotalDatasetLinksCount] = useState<number>(0);
    const [reposReady, setReposReady] = useState<boolean>(false);

    const sizeOptions: DropDownOption[] = [{value: DEFAULT_PAGE_SIZE, label: DEFAULT_PAGE_SIZE}, {
        value: "30",
        label: "30"
    }, {value: "40", label: "40"}];
    const groupByOptions: DropDownOption[] = [{value: DEFAULT_GROUP_BY, label: "Dataset"}, {
        value: "term",
        label: "Term"
    }];


    function renderDatasetLinks() {
        let content = [];
        if (groupBy === DEFAULT_GROUP_BY) {
            content = [...renderByDataset()];
        } else {
            content = [...renderByTerm()];
        }
        setTableContent(content);
        setLoading(false);
        return true;
    }

    function renderDatasetTableEntry(datasetTitle: string, datasetDescription?: string) {
        return (
            <>
                <a href={`${process.env.REACT_APP_NFDI4CHEM_SEARCH_SERVICE_URL}/dataset/${datasetTitle}`}
                   target="_blank"
                   rel="noopener noreferrer">
                    {datasetTitle}
                </a>
                {datasetDescription &&
                  <div className="mt-2">
                    <TruncatedText text={datasetDescription} length={50} pClassName="d-inline-block"/>
                  </div>
                }
            </>
        );
    }

    function createTermLinkHref(curie: string) {
        let targetHref = process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + encodeURIComponent(ontologyPageContext.ontology.ontologyId) + "/terms?curie=";
        return targetHref + encodeURIComponent(curie);
    }

    function renderCurieTableEntry(curie: string, label: string) {
        if (curie.includes("_")) {
            curie = curie.replace("_", ":");
        }
        return (
            <a href={createTermLinkHref(curie)} target="_blank"
               rel="noopener noreferrer">
                <span className="term-button linked-datasets-term-tag">{label}</span>
            </a>
        );
    }

    function renderByDataset() {
        let results = [];
        for (let [datasetTitle, dls] of datasetLinksMap) {
            let datasetDescription = "";
            for (let dl of dls) {
                if (dl.dataset_title === datasetTitle) {
                    datasetDescription = dl.dataset_description ?? "";
                    break;
                }
            }
            results.push(
                <tr>
                    <td className="col-6">{renderDatasetTableEntry(datasetTitle, datasetDescription)}</td>
                    {!inputCurie &&
                      <td
                        className="col-6">{dls.map((dl: DatasetLink) => renderCurieTableEntry(dl.curie!, dl.term_label!))}</td>}
                </tr>
            );
        }
        return results;
    }

    function renderByTerm() {
        let results = [];
        let truncateLimit = 5;
        for (let [curie, dls] of datasetLinksMap) {
            let termLabel = "";
            for (let dl of dls) {
                if (dl.curie === curie) {
                    termLabel = dl.term_label!;
                    break;
                }
            }
            results.push(
                <tr>
                    <td className="col-6">{renderCurieTableEntry(curie, termLabel)}</td>
                    <td className="col-6">
                        {dls.map((dl: DatasetLink, index: number) =>
                            <div key={index} className={index + 1 > truncateLimit ? "d-none" : ""}>
                                {renderDatasetTableEntry(dl.dataset_title!)}
                            </div>
                        )}
                        {dls.length > truncateLimit &&
                          <a href={createTermLinkHref(curie) + "&subtab=linked_datasets"} target="_blank"
                             rel="noopener noreferrer"
                             className="btn-secondary mt-2">
                              {`Check ${dls.length - truncateLimit} more datasets.`}
                          </a>
                        }
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
        urlFactory.setParam({name: SiteUrlParamNames.GroupBy, value: newGroupBy, updateUrl: true});
    }


    function filterByRepo(e: React.ChangeEvent<HTMLSelectElement>) {
        let repoId = parseInt(e.target.value);
        setSelectedRepo(repoId);
        if (repoId) {
            urlFactory.setParam({
                name: SiteUrlParamNames.Repository,
                value: datasetRepos.find((repo: DropDownOption) => repo.value === repoId)?.label as string,
                updateUrl: true,
            });
        } else {
            urlFactory.deleteParam({name: SiteUrlParamNames.Repository});
        }
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
            repository: repo?.value! > 0 ? repo?.label as string : undefined,
            curie: inputCurie ? inputCurie : undefined,
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
        reposOptions.push({value: 0, label: "All Repositories"});
        let id = 1;
        for (let title of ontologyPageContext.repositories) {
            reposOptions.push({value: id++, label: title});
        }
        setSelectedRepo(reposOptions.find((op: DropDownOption) => op.label === repositoryFromUrl)?.value as number ?? 0);
        setDatasetRepos(reposOptions);
        setReposReady(true);
    }


    useEffect(() => {
        loadDatasetRepositoriesOptions();
    }, []);


    useEffect(() => {
        if (!reposReady) {
            return;
        }
        setDatasetLinksMap(new Map());
        setDataIsReady(false);
        setLoading(true);
        fetchData();
    }, [page, size, groupBy, selectedRepo, inputCurie, repositoryFromUrl, reposReady]);

    useEffect(() => {
        if (dataIsReady) {
            renderDatasetLinks();
        }
    }, [dataIsReady]);

    if (datasetLinksMap.size === 0 && dataIsReady) {
        return (<AlertBox message="No dataset link found." type="info"/>);
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="row mb-3 mt-3">
                    {!inputCurie &&
                      <div className="col-sm-3">
                        <DropDown
                          defaultValue={groupByFromUrl}
                          options={groupByOptions}
                          dropDownId="dataset-links-group-by"
                          dropDownTitle="Group by"
                          dropDownChangeHandler={handleGroupByChange}
                        />
                      </div>
                    }
                    <div className={!inputCurie ? "col-sm-3" : "col-sm-4"}>
                        <DropDown
                            dropDownValue={selectedRepo}
                            options={datasetRepos}
                            dropDownId="dataset-repos-filter"
                            dropDownChangeHandler={filterByRepo}
                            containerClass="mt-1"
                        />
                    </div>
                    <div className={!inputCurie ? "col-sm-3" : "col-sm-4 text-center"}>
                        <DropDown
                            defaultValue={sizeFromUrl}
                            options={sizeOptions}
                            dropDownId="dataset-links-page-size"
                            dropDownTitle="Page size"
                            dropDownChangeHandler={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setSize(parseInt(e.target.value));
                                setPage(1);
                                urlFactory.setParam({
                                    name: SiteUrlParamNames.Size,
                                    value: e.target.value,
                                    updateUrl: true
                                });
                            }}
                        />
                    </div>
                    <div className={!inputCurie ? "col-sm-3" : "col-sm-4"}>
                        <Pagination
                            clickHandler={(newPage: number) => {
                                setPage(newPage);
                                urlFactory.setParam({
                                    name: SiteUrlParamNames.Page,
                                    value: newPage.toString(),
                                    updateUrl: true
                                });
                            }}
                            count={Math.ceil(totalDatasetLinksCount / size)}
                            initialPageNumber={page}
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
                <Table striped bordered responsive className="linked-datasets-table">
                    <thead>
                    <tr>
                        <th>Dataset</th>
                        {!inputCurie && <th>Linked terms</th>}
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
