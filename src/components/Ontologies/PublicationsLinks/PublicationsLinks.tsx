import {getPublicationsLinks, createPublicationLink, deletePublicationLink} from "../../../api/publicationsLinks";
import {useState, useEffect, useContext} from "react";
import {OntologyPageContext} from "../../../context/OntologyPageContext";
import {AppContext} from "../../../context/AppContext";


const PublicationsLinks = () => {


    if (process.env.REACT_APP_PUBLICATION_LINKS !== "true") {
        return <></>;
    }

    return (
        <>
            <p>Publications Links</p>
        </>
    );
}

export default PublicationsLinks;