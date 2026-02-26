import {RouteComponentProps} from "react-router-dom";
import collectionsInfoJson from "../../assets/collectionsText.json";
import {CollectionJsonData} from "./types";
import {useState, useEffect} from "react";
import NotFound from "../../errors/notFound";
import Nav from "react-bootstrap/Nav";


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

                </div>
            </div>

        </div>
    );
}

export default CollectionPage;