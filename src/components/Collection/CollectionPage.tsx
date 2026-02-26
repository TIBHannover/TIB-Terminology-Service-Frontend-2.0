import {Link, RouteComponentProps} from "react-router-dom";
import collectionsInfoJson from "../../assets/collectionsText.json";
import {CollectionJsonData} from "./types";
import {useState, useEffect} from "react";
import NotFound from "../../errors/notFound";
import Nav from "react-bootstrap/Nav";
import OntologyApi from "../../api/ontology";
import {TsOntology} from "../../concepts";
import "../layout/ontologyList.css";


type CmpProps = RouteComponentProps<{ collectionId: string }>;
type CollectionsData = Record<string, CollectionJsonData>;

const ABOUT_TAB_ID = "about";
const ONTOLOGIES_TAB_ID = "ontologies";
const API_TAB_ID = "api";

const CollectionPage = (props: CmpProps) => {
    const collectionIdFromUrl = props.match.params.collectionId;
    const CollectionsMetadata = collectionsInfoJson as CollectionsData;

    const [collection, setCollection] = useState<CollectionJsonData | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [activeTabId, setActiveTabId] = useState<string>(ABOUT_TAB_ID);
    const [ontologyList, setOntologyList] = useState<TsOntology[]>([]);

    function renderAboutSection() {
        return (
            <>
                <div dangerouslySetInnerHTML={{__html: collection?.text ?? ""}}></div>
                {collection?.selection_criteria &&
                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="fs-4 fw-bold">Selection criteria</p>
                      <div dangerouslySetInnerHTML={{__html: collection?.selection_criteria ?? ""}}></div>
                    </div>
                  </div>
                }
            </>
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
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="about">About</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ontologies">Ontologies</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="api">API</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {activeTabId === ABOUT_TAB_ID && renderAboutSection()}
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