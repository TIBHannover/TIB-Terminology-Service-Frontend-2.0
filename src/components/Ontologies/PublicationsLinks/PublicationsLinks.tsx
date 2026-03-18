import {getPublicationsLinks, createPublicationLink, deletePublicationLink} from "../../../api/publicationsLinks";
import {useState, useEffect, useContext} from "react";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {AppContext} from "../../../context/AppContext";
import {Publication} from "../../../api/types/publicationsLinks";
import {TextInput} from "../../common/Input/Input";
import "../../layout/publicationLink.css";
import {DeleteModal} from "../../common/DeleteModal/DeleteModal";
import {getTsPluginHeaders} from "../../../api/header";
import AlertBox from "../../common/Alerts/Alerts";


const PublicationsLinks = () => {

    const ontologyPageContext = useContext(OntologyPageContext);
    const appContext = useContext(AppContext);

    const [publicationsLinks, setPublicationsLinks] = useState<Publication[]>([]);
    const [creationMode, setCreationMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enteredDoi, setEnteredDoi] = useState("");
    const [showCreationSuccessMessage, setShowCreationSuccessMessage] = useState(false);
    const [creationError, setCreationError] = useState("");
    const [creationLoading, setCreationLoading] = useState(false);


    async function handlePublicationCreation() {
        if (!enteredDoi) {
            let doiInput = document.getElementById("pub-doi") as HTMLInputElement;
            doiInput.style.borderColor = "red";
            return;
        }
        setCreationLoading(true);
        let pub = await createPublicationLink(ontologyPageContext.ontology.ontologyId, enteredDoi);
        if (pub.id) {
            setCreationMode(false);
            setShowCreationSuccessMessage(true);
            setCreationError("");
            setPublicationsLinks([...publicationsLinks, pub]);
            setEnteredDoi("");
            setCreationLoading(false);
            setTimeout(() => {
                setShowCreationSuccessMessage(false);
            }, 2000);
        } else {
            setCreationError(pub.fetchError ?? "");
            setShowCreationSuccessMessage(false);
            setCreationLoading(false);
            setTimeout(() => {
                setCreationError("");
            }, 4000);
        }
    }

    function renderPublicationCreationForm() {
        return (
            <>
                <div className="row pt-4 pb-4">
                    <div className="col-sm-12">
                        <button className="btn btn-secondary" onClick={() => setCreationMode(false)}>Back to list
                        </button>
                    </div>
                </div>
                {creationError &&
                  <AlertBox message={"Error: " + creationError} type="danger"/>
                }
                <div className="row">
                    <div className="col-sm-8">
                        <TextInput
                            placeholder="Enter the publication doi ..."
                            id="pub-doi"
                            defaultValue=""
                            label="Publication DOI"
                            required={true}
                            onchange={(e: React.ChangeEvent<Element>) => {
                                let value = (e.target as HTMLInputElement).value;
                                (e.target as HTMLInputElement).style.borderColor = "";
                                setEnteredDoi(value);
                                setCreationError("");
                            }}
                        />
                    </div>
                    <div className="col-sm-4 mt-4">
                        <button className="btn btn-secondary" onClick={handlePublicationCreation}>
                            Add
                            {creationLoading &&
                              <div className="isLoading-btn"></div>
                            }
                        </button>
                    </div>
                </div>
            </>
        );
    }

    function renderPublicationList() {
        const callHeader = getTsPluginHeaders({withAccessToken: true});
        let deleteEndpoint = process.env.REACT_APP_MICRO_BACKEND_ENDPOINT + "/pub_link/delete/";
        let redirectAfterDeleteUrl = process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies/" + ontologyPageContext.ontology.ontologyId + "/publications/";
        return (
            <>
                {publicationsLinks.map((pub: Publication) => {
                    return (
                        <div className="row publication-card">
                            <div className="col-sm-11">
                                <p className="fs-6">{pub.citation}</p>
                                <a href={"https://doi.org/" + pub.doi} target="_blank"
                                   rel="noreferrer nofollow">
                                    {pub.doi}
                                    <i className="fa fa-solid fa-up-right-from-square border-0"></i>
                                </a>
                            </div>
                            {appContext.user && appContext.user.id === pub.creator &&
                              <div className="col-sm-1 text-end">
                                <DeleteModal
                                  modalId={String(pub.id) ?? ""}
                                  callHeaders={callHeader}
                                  deleteEndpoint={deleteEndpoint + pub.id + "/"}
                                  afterDeleteRedirectUrl={redirectAfterDeleteUrl}
                                  key={"deletePublink" + pub.id}
                                  afterDeleteProcess={() => {
                                  }}
                                  objectToDelete={pub}
                                  method="DELETE"
                                    //@ts-ignore
                                  btnText={<i className="fa fa-close fa-borderless"></i>}
                                  btnClass="extra-sm-btn ml-2"
                                />
                              </div>
                            }
                        </div>
                    )
                })}
            </>
        );
    }

    useEffect(() => {
        getPublicationsLinks(ontologyPageContext.ontology.ontologyId).then((pubList: Publication[]) => {
            setPublicationsLinks(pubList);
            setLoading(false);
        }).catch((error: any) => {
            setLoading(false);
        });
    }, []);


    if (process.env.REACT_APP_PUBLICATION_LINKS !== "true") {
        return <></>;
    }

    return (
        <div className="row publication-links-container">
            <div className="col-sm-12">
                <div className="row mb-3">
                    <div className="col-sm-9">
                        <h4 className="mb-3"><b>Related publications</b></h4>
                    </div>
                    <div className="col-sm-3 text-end">
                        <button className="btn btn-secondary" onClick={() => {
                            setCreationMode(true);
                        }}><i className="fa fa-plus border-0"></i> Publication to this ontology
                        </button>
                    </div>
                </div>
                {creationMode && renderPublicationCreationForm()}
                {showCreationSuccessMessage &&
                  <AlertBox message="Publication has been added." type="success"/>
                }
                {!creationMode &&
                  <div className="row">
                    <div className="col-sm-9">
                        {loading && <div className="isLoading"></div>}
                        {!loading && publicationsLinks.length === 0 && <p>No publications found</p>}
                        {!loading && publicationsLinks.length > 0 && renderPublicationList()}
                    </div>

                  </div>
                }
            </div>
        </div>
    );
}

export default PublicationsLinks;