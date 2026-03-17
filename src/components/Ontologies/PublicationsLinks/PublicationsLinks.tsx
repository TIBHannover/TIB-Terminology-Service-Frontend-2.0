import {getPublicationsLinks, createPublicationLink, deletePublicationLink} from "../../../api/publicationsLinks";
import {useState, useEffect, useContext} from "react";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {AppContext} from "../../../context/AppContext";
import {Publication} from "../../../api/types/publicationsLinks";
import {TextInput} from "../../common/Input/Input";


const PublicationsLinks = () => {

    const ontologyPageContext = useContext(OntologyPageContext);
    const appContext = useContext(AppContext);

    const [publicationsLinks, setPublicationsLinks] = useState<Publication[]>([]);
    const [creationMode, setCreationMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enteredDoi, setEnteredDoi] = useState("");


    function renderPublicationCreationForm() {
        return (
            <>
                <div className="row pt-4 pb-4">
                    <div className="col-sm-12">
                        <button className="btn btn-secondary" onClick={() => setCreationMode(false)}>Back to list
                        </button>
                    </div>
                </div>
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
                                setEnteredDoi(value);
                            }}
                        />
                    </div>
                    <div className="col-sm-4 mt-4">
                        <button className="btn btn-secondary" onClick={() => {
                            createPublicationLink(ontologyPageContext.ontology.ontologyId, enteredDoi).then((pub: Publication) => {
                                console.log("created publication", pub);
                            })
                        }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </>
        );
    }


    if (process.env.REACT_APP_PUBLICATION_LINKS !== "true") {
        return <></>;
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <h4>Publications</h4>
                {creationMode && renderPublicationCreationForm()}
                {!creationMode &&
                  <div className="row">
                    <div className="col-sm-9">
                      List
                    </div>
                    <div className="col-sm-3">
                      <button className="btn btn-secondary" onClick={() => {
                          setCreationMode(true);
                      }}><i className="fa fa-plus border-0"></i> Publication to this ontology
                      </button>
                    </div>
                  </div>
                }
            </div>
        </div>
    );
}

export default PublicationsLinks;