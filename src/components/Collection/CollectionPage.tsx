import {Link, RouteComponentProps} from "react-router-dom";
import collectionsInfoJson from "../../assets/collectionsText.json";
import {CollectionJsonData} from "./types";
import {useState, useEffect} from "react";
import NotFound from "../../errors/notFound";
import Nav from "react-bootstrap/Nav";
import OntologyApi from "../../api/ontology";
import {TsOntology} from "../../concepts";
import "../layout/ontologyList.css";
import {getBioregistryCollection} from "../../api/collection";
import {BioregistryCollection} from "../../api/types/collectionTypes";
import ReactMarkdown from "react-markdown";


type CmpProps = RouteComponentProps<{ collectionId: string }>;
type CollectionsData = Record<string, CollectionJsonData>;

const ABOUT_TAB_ID = "about";
const BIOREGISTRY_TAB_ID = "bioregistry";
const ONTOLOGIES_TAB_ID = "ontologies";
const API_TAB_ID = "api";

const CollectionPage = (props: CmpProps) => {
    const collectionIdFromUrl = props.match.params.collectionId;
    const CollectionsMetadata = collectionsInfoJson as CollectionsData;

    const [collection, setCollection] = useState<CollectionJsonData | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [activeTabId, setActiveTabId] = useState<string>(ABOUT_TAB_ID);
    const [ontologyList, setOntologyList] = useState<TsOntology[]>([]);
    const [bioregistryCollection, setBioregistryCollection] = useState<BioregistryCollection>({});

    function renderAboutSection() {
        return (
            <div>
                <div dangerouslySetInnerHTML={{__html: collection?.text ?? ""}}></div>
                {collection?.selection_criteria &&
                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="fs-4 fw-bold">Selection criteria</p>
                      <div dangerouslySetInnerHTML={{__html: collection?.selection_criteria ?? ""}}></div>
                    </div>
                  </div>
                }
            </div>
        );
    }


    function buildOntologyCard(item: TsOntology, identifier: number) {
        return (
            <div className="row result-card stour-ontology-card-in-list" id={'ontology_' + identifier}
                 key={item.ontologyId}>
                <div className='col-sm-9'>
                    <div className="ontology-card-title-section">
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId}
                              className='ontology-button btn btn-secondary stour-onto-id'>{item.ontologyId}</Link>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + '/ontologies/' + item.ontologyId}
                              className="ontology-title-text-in-box stour-onto-name"><b>{item.title}</b></Link>
                    </div>
                    <div className="ontology-card-description stour-onto-description">
                        <p className="trunc-text">{item.description.substring(0, 100) + " ... "}</p>
                        <a className="read-more-btn" data-value={item.description}
                           onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                               let fullDescp = e.currentTarget.getAttribute("data-value") ?? "";
                               let p = e.currentTarget.previousElementSibling;
                               if (!p) {
                                   return
                               }
                               if (e.currentTarget.textContent === "[Read more]") {
                                   p.textContent = fullDescp;
                                   e.currentTarget.textContent = "[Read less]"
                               } else {
                                   p.textContent = fullDescp.substring(0, 100) + " ... ";
                                   e.currentTarget.textContent = "[Read more]"
                               }
                           }}
                        >
                            [Read more]</a>
                    </div>
                </div>
                <div className="col-sm-3 ontology-card-meta-data">
                    <span
                        className='ontology-meta-data-field-span stour-onto-class-count'>{item.numberOfClasses} Classes</span>
                    <hr/>
                    <span
                        className='ontology-meta-data-field-span stour-onto-props-count'>{item.numberOfProperties} Properties</span>
                    <hr/>
                    <span
                        className='ontology-meta-data-field-span stour-onto-loaded-time'>Loaded: {item.loaded ? item.loaded.split("T")[0] : "N/A"}</span>
                </div>
            </div>

        );
    }

    function renderOntologyList() {
        let result = [];
        let counter = 0;
        for (let onto of ontologyList) {
            result.push(buildOntologyCard(onto, counter));
            counter++;
        }
        return result;
    }

    function renderBioregistryInfo() {
        function renderAuthors() {
            if (!bioregistryCollection.authors) {
                return <></>;
            }
            return (
                <div className="mt-2 border-1 bg-light rounded p-2">
                    <p>Authors: </p>
                    {bioregistryCollection.authors.map((author, index) => {
                        return (
                            <div className="mt-1">
                                <p className="d-inline fw-bold">{author.name}</p>
                                {author.orcid &&
                                  <a href={"https://orcid.org/" + author.orcid} target="_blank"
                                     rel="noopener noreferrer">
                                    <i className="fa-brands fa-orcid fs-5 ms-2"></i>
                                  </a>
                                }
                                {author.email &&
                                  <a href={"mailto:" + author.email} target="_blank" rel="noopener noreferrer">
                                    <i className="fa-solid fa-envelope fs-5 ms-2"></i>
                                  </a>
                                }
                                {author.github &&
                                  <a href={"https://github.com/" + author.github} target="_blank">
                                    <i className="fa-brands fa-github fs-5 ms-2"></i>
                                  </a>
                                }
                            </div>
                        )
                    })}
                </div>
            )
        }

        function renderOrgs() {
            if (!bioregistryCollection.organizations) {
                return <></>
            }
            return (
                <div className="mt-2 border-1 bg-light rounded p-2">
                    <p>Organizations: </p>
                    {bioregistryCollection.organizations.map((org, index) => {
                        return (
                            <div className="mt-1">
                                <p className="d-inline fw-bold me-2">{org.name}</p>
                                {org.ror &&
                                  <a href={"https://ror.org/" + org.ror} target="_blank" rel="noopener noreferrer">
                                    ror
                                  </a>
                                }
                                {org.wikidata &&
                                  <a href={"https://www.wikidata.org/wiki/" + org.wikidata} target="_blank"
                                     rel="noopener noreferrer" className="ms-2">
                                    wikidata
                                  </a>
                                }
                            </div>
                        )
                    })}
                </div>
            )
        }

        function renderReferences() {
            if (!bioregistryCollection.references) {
                return <></>
            }
            return (
                <div className="mt-2 border-1 bg-light rounded p-2">
                    <p>References: </p>
                    <ul>
                        {bioregistryCollection.references.map((ref, index) => {
                            return (
                                <li><a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a></li>
                            )
                        })}
                    </ul>
                </div>
            )
        }

        if (!bioregistryCollection.name) {
            return <div>No bioregistry info available</div>;
        }
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div>
                        <p className="d-inline">Bioregistry identifier: </p>
                        <p className="d-inline fw-bold">{bioregistryCollection.identifier}</p>
                    </div>
                    {bioregistryCollection.description &&
                      <div className="mt-2 p-4 border-1 bg-light rounded">
                        <p className="text-justify">
                          <ReactMarkdown>{bioregistryCollection.description}</ReactMarkdown>
                        </p>
                      </div>
                    }
                    {renderAuthors()}
                    {renderOrgs()}
                    {renderReferences()}
                </div>
            </div>
        );
    }

    useEffect(() => {
        let processedCollectionId = collectionIdFromUrl.split("_").join(" ");
        let collectionIds = Object.keys(CollectionsMetadata);
        for (let colId of collectionIds) {
            if (colId.toLowerCase() === processedCollectionId.toLowerCase()) {
                setCollection(CollectionsMetadata[colId]);
                break;
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (collection?.id) {
            const ontoApi = new OntologyApi({});
            ontoApi.fetchOntologyList(collection?.id).then((ontologies) => {
                setOntologyList(ontologies);
            });
            getBioregistryCollection(collection.id).then((bioregistryCollection) => {
                setBioregistryCollection(bioregistryCollection);
            });
        }
    }, [collection]);


    if (!loading && !collection) {
        return (
            <div className="row">
                <NotFound/>
            </div>
        );
    }

    return (
        <div className="row bg-white p-4">
            <div className="col-12">
                {/*<p className="fs-3 fw-bold text-center">{collection?.name}</p>*/}
            </div>
            <div className="row mb-3">
                <div className="col-4">
                    <img className="img-fluid" src={collection?.logo} alt={collection?.name}/>
                    <hr/>
                    <div className="p-1">
                        <p className="fw-bold d-inline me-1">Homepage: </p>
                        <a href={collection?.project_homepage} target="_blank"
                           rel="noopener noreferrer">{collection?.project_homepage}</a>
                    </div>
                    {collection?.domain_ts_link &&
                      <div className="p-1">
                        <p className="fw-bold d-inline me-1">Domain TS: </p>
                        <a href={collection?.domain_ts_link} target="_blank"
                           rel="noopener noreferrer">{collection?.domain_ts_link}</a>
                      </div>
                    }

                </div>
                <div className="col-8">
                    <Nav
                        variant="tabs"
                        defaultActiveKey={activeTabId}
                        onSelect={(key) => setActiveTabId(key as string)}
                        className="mb-3"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="about">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="bioregistry">Bioregistry Info</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ontologies">Ontologies ({ontologyList.length})</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="api">API</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {activeTabId === ABOUT_TAB_ID && renderAboutSection()}
                    {activeTabId === BIOREGISTRY_TAB_ID && renderBioregistryInfo()}
                    {activeTabId === ONTOLOGIES_TAB_ID &&
                      <div className="row p-4 bg-light">
                          {renderOntologyList()}
                      </div>
                    }

                </div>
            </div>

        </div>
    );
}

export default CollectionPage;