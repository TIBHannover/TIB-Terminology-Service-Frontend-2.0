import { Link, RouteComponentProps } from "react-router-dom";
import collectionsInfoJson from "../../assets/collectionsText.json";
import { CollectionJsonData } from "./types";
import { useState, useEffect } from "react";
import NotFound from "../../errors/notFound";
import Nav from "react-bootstrap/Nav";
import OntologyApi from "../../api/ontology";
import { TsOntology } from "../../concepts";
import "../layout/ontologyList.css";
import { BioregistryCollection } from "../../api/types/collectionTypes";
import CopyLinkButton from "../common/CopyButton/CopyButton";
import CommonUrlFactory from "../../UrlFactory/CommonUrlFactory";
import Toolkit from "../../Libs/Toolkit";

type CmpProps = RouteComponentProps<{ collectionId: string }>;
type CollectionsData = Record<string, CollectionJsonData>;
type stats = {
  numberOfClasses: number;
  numberOfProperties: number;
  numberOfOntologies: number;
  numberOfIndividuals: number;
  lastModified: string;
};

const ABOUT_TAB_ID = "about";
const BIOREGISTRY_TAB_ID = "bioregistry";
const ONTOLOGIES_TAB_ID = "ontologies";
const API_TAB_ID = "api";
const TABS_LIST = [
  ABOUT_TAB_ID,
  BIOREGISTRY_TAB_ID,
  ONTOLOGIES_TAB_ID,
  API_TAB_ID,
];

const CollectionPage = (props: CmpProps) => {
  const collectionIdFromUrl = props.match.params.collectionId;
  const CollectionsMetadata = collectionsInfoJson as CollectionsData;

  const urlFactory = new CommonUrlFactory();
  let tabFromUrl = urlFactory.getParam({ name: "tab" }) ?? ABOUT_TAB_ID;
  if (!TABS_LIST.includes(tabFromUrl)) {
    tabFromUrl = ABOUT_TAB_ID;
  }

  const [collection, setCollection] = useState<CollectionJsonData | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState<string>(tabFromUrl);
  const [ontologyList, setOntologyList] = useState<TsOntology[]>([]);
  // const [bioregistryCollection, setBioregistryCollection] =
  // useState<BioregistryCollection>({});
  const [stats, setStats] = useState<stats>({
    numberOfClasses: 0,
    numberOfProperties: 0,
    numberOfOntologies: 0,
    numberOfIndividuals: 0,
    lastModified: "",
  });

  function renderAboutSection() {
    return (
      <div>
        {Toolkit.renderDangerousHtml(collection?.text)}
        {collection?.selection_criteria && (
          <div className="row mt-4">
            <div className="col-12">
              <p className="fs-4 fw-bold">Selection criteria</p>
              {Toolkit.renderDangerousHtml(collection?.selection_criteria)}
            </div>
          </div>
        )}
      </div>
    );
  }

  function buildOntologyCard(item: TsOntology, identifier: number) {
    return (
      <div
        className="row result-card stour-ontology-card-in-list"
        id={"ontology_" + identifier}
        key={item.ontologyId}
      >
        <div className="col-sm-9">
          <div className="ontology-card-title-section">
            <Link
              to={
                process.env.REACT_APP_PROJECT_SUB_PATH +
                "/ontologies/" +
                item.ontologyId
              }
              className="ontology-button btn btn-secondary stour-onto-id"
            >
              {item.ontologyId}
            </Link>
            <Link
              to={
                process.env.REACT_APP_PROJECT_SUB_PATH +
                "/ontologies/" +
                item.ontologyId
              }
              className="ontology-title-text-in-box stour-onto-name"
            >
              <b>{item.title}</b>
            </Link>
          </div>
          <div className="ontology-card-description stour-onto-description">
            <p className="trunc-text">
              {item.description.substring(0, 100) + " ... "}
            </p>
            <a
              className="read-more-btn"
              data-value={item.description}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                let fullDescp =
                  e.currentTarget.getAttribute("data-value") ?? "";
                let p = e.currentTarget.previousElementSibling;
                if (!p) {
                  return;
                }
                if (e.currentTarget.textContent === "[Read more]") {
                  p.textContent = fullDescp;
                  e.currentTarget.textContent = "[Read less]";
                } else {
                  p.textContent = fullDescp.substring(0, 100) + " ... ";
                  e.currentTarget.textContent = "[Read more]";
                }
              }}
            >
              [Read more]
            </a>
          </div>
        </div>
        <div className="col-sm-3 ontology-card-meta-data">
          <span className="ontology-meta-data-field-span stour-onto-class-count">
            {item.numberOfClasses} Classes
          </span>
          <hr />
          <span className="ontology-meta-data-field-span stour-onto-props-count">
            {item.numberOfProperties} Properties
          </span>
          <hr />
          <span className="ontology-meta-data-field-span stour-onto-loaded-time">
            Loaded: {item.loaded ? item.loaded.split("T")[0] : "N/A"}
          </span>
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

  function renderApiDoc() {
    let collectionUrlPostfix = `schema=collection&classification=${collection?.id}&option=COMPOSITE`;
    let searchEndpoint = `${process.env.REACT_APP_API_URL}/v2/entities?search=data&page=0&size=10&lang=en&exclusive=true&facetFields=type+ontologyId&${collectionUrlPostfix}`;
    let ontologiesListEndpoint = `${process.env.REACT_APP_API_URL}/v2/ontologies?size=1000&${collectionUrlPostfix}`;
    let statsEndpoint = `${process.env.REACT_APP_API_URL}/v2/statsby?schema=collection&classification=${collection?.id}`;
    return (
      <div className="row">
        <div className="col-sm-12">
          <p>
            Search (query: <b>data</b>)
          </p>
          <div className="mt-2 p-4 border-1 bg-light rounded overflow-auto text-nowrap">
            <CopyLinkButton valueToCopy={searchEndpoint} />
            <a
              href={searchEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              {searchEndpoint}
            </a>
          </div>
          <p className="mt-4">Ontologies list</p>
          <div className="p-4 border-1 bg-light rounded overflow-auto text-nowrap">
            <CopyLinkButton valueToCopy={ontologiesListEndpoint} />
            <a
              href={ontologiesListEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              {ontologiesListEndpoint}
            </a>
          </div>
          <p className="mt-4">Stats</p>
          <div className="p-4 border-1 bg-light rounded overflow-auto text-nowrap">
            <CopyLinkButton valueToCopy={statsEndpoint} />
            <a
              href={statsEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              {statsEndpoint}
            </a>
          </div>
        </div>
      </div>
    );
  }

  function renderCollectionStats() {
    return (
      <>
        <div className="p-1">
          <p className="fw-bold d-inline me-1">Number of ontologies: </p>
          <p className="d-inline me-1">
            {Toolkit.numberPrettifier(stats.numberOfOntologies)}
          </p>
        </div>
        <div className="p-1">
          <p className="fw-bold d-inline me-1">Number of classes: </p>
          <p className="d-inline me-1">
            {Toolkit.numberPrettifier(stats.numberOfClasses)}
          </p>
        </div>
        <div className="p-1">
          <p className="fw-bold d-inline me-1">Number of properties: </p>
          <p className="d-inline me-1">
            {Toolkit.numberPrettifier(stats.numberOfProperties)}
          </p>
        </div>
        <div className="p-1">
          <p className="fw-bold d-inline me-1">Number of individuals: </p>
          <p className="d-inline me-1">
            {Toolkit.numberPrettifier(stats.numberOfIndividuals)}
          </p>
        </div>
      </>
    );
  }

  function renderTabs() {
    return (
      <Nav
        variant="tabs"
        defaultActiveKey={activeTabId}
        onSelect={(key) => {
          urlFactory.setParam({ name: "tab", value: key as string });
          setActiveTabId(key as string);
        }}
        className="mb-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="about">About</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item> */}
        {/*     <Nav.Link */}
        {/*         eventKey="bioregistry" */}
        {/*         title="The Semantic Farm is an open source, domain-agnostic, community curated semantic space registry, meta-registry, and compact identifier resolver. " */}
        {/*     > */}
        {/*         Semantic */}
        {/*         Farm */}
        {/*     </Nav.Link> */}
        {/* </Nav.Item> */}
        <Nav.Item>
          <Nav.Link eventKey="ontologies">
            Ontologies ({ontologyList.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="api">API</Nav.Link>
        </Nav.Item>
      </Nav>
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
      // getBioregistryCollection(collection.id).then((bioregistryCollection) => {
      //   setBioregistryCollection(bioregistryCollection);
      // });
      fetch(
        process.env.REACT_APP_API_URL +
          "/v2/statsby?schema=collection&classification=" +
          collection.id,
      ).then((response) => {
        response.json().then((data: stats) => {
          setStats(data);
        });
      });
    }
  }, [collection]);

  if (!loading && !collection) {
    return (
      <div className="row">
        <NotFound />
      </div>
    );
  }

  return (
    <div className="row bg-white p-4">
      <div className="row mb-3">
        <div className="col-4">
          <img
            className="img-fluid"
            src={
              process.env.REACT_APP_PROJECT_SUB_PATH?.includes("terminology")
                ? process.env.REACT_APP_PROJECT_SUB_PATH! + collection?.logo
                : collection?.logo
            }
            alt={collection?.name}
          />
          <hr />
          <div className="p-1">
            <p className="fw-bold d-inline me-1">Homepage: </p>
            <a
              href={collection?.project_homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              {collection?.project_homepage}
            </a>
          </div>
          {collection?.domain_ts_link && (
            <div className="p-1">
              <p className="fw-bold d-inline me-1">Domain TS: </p>
              <a
                href={collection?.domain_ts_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {collection?.domain_ts_link}
              </a>
            </div>
          )}
          {renderCollectionStats()}
        </div>
        <div className="col-8">
          {renderTabs()}
          {activeTabId === ABOUT_TAB_ID && renderAboutSection()}
          {/* {activeTabId === BIOREGISTRY_TAB_ID && ( */}
          {/*   <BioregistryPage bioregistryCollection={bioregistryCollection} /> */}
          {/* )} */}
          {activeTabId === ONTOLOGIES_TAB_ID && (
            <div className="row p-4 ontology-list-container">
              {renderOntologyList()}
            </div>
          )}
          {activeTabId === API_TAB_ID && renderApiDoc()}
        </div>
      </div>
    </div>
  );
};

// const BioregistryPage = (props: {
//   bioregistryCollection: BioregistryCollection;
// }) => {
//   const { bioregistryCollection } = props;
//
//   function renderAuthors() {
//     if (!bioregistryCollection.authors) {
//       return <></>;
//     }
//     return (
//       <div className="mt-2 border-1 bg-light rounded p-2">
//         <p>Authors: </p>
//         {bioregistryCollection.authors.map((author, index) => {
//           return (
//             <div className="mt-1">
//               <p className="d-inline fw-bold">{author.name}</p>
//               {author.orcid && (
//                 <a
//                   href={"https://orcid.org/" + author.orcid}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <i className="fa-brands fa-orcid fs-5 ms-2"></i>
//                 </a>
//               )}
//               {author.email && (
//                 <a
//                   href={"mailto:" + author.email}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <i className="fa-solid fa-envelope fs-5 ms-2"></i>
//                 </a>
//               )}
//               {author.github && (
//                 <a href={"https://github.com/" + author.github} target="_blank">
//                   <i className="fa-brands fa-github fs-5 ms-2"></i>
//                 </a>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

// function renderOrgs() {
//   if (!bioregistryCollection.organizations) {
//     return <></>;
//   }
//   return (
//     <div className="mt-2 border-1 bg-light rounded p-2">
//       <p>Organizations: </p>
//       {bioregistryCollection.organizations.map((org, index) => {
//         return (
//           <div className="mt-1">
//             <p className="d-inline fw-bold me-2">{org.name}</p>
//             {org.ror && (
//               <a
//                 href={"https://ror.org/" + org.ror}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 ror
//               </a>
//             )}
//             {org.wikidata && (
//               <a
//                 href={"https://www.wikidata.org/wiki/" + org.wikidata}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="ms-2"
//               >
//                 wikidata
//               </a>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

//   function renderReferences() {
//     if (!bioregistryCollection.references) {
//       return <></>;
//     }
//     return (
//       <div className="mt-2 border-1 bg-light rounded p-2">
//         <p>References: </p>
//         <ul>
//           {bioregistryCollection.references.map((ref, index) => {
//             return (
//               <li>
//                 <a href={ref} target="_blank" rel="noopener noreferrer">
//                   {ref}
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );
//   }
//
//   if (!bioregistryCollection.name) {
//     return <div>No bioregistry info available</div>;
//   }
//   return (
//     <div className="row">
//       <div className="col-sm-12">
//         <div className="row">
//           <div className="col-sm-6">
//             <p className="d-inline">Bioregistry identifier: </p>
//             <p className="d-inline fw-bold">
//               {bioregistryCollection.identifier}
//             </p>
//           </div>
//           <div className="col-sm-6 text-end">
//             <a
//               href="https://semantic.farm/"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <small>About Semantic Farm</small>
//               <i
//                 className="fa fa-external-link border-0"
//                 aria-hidden="true"
//               ></i>
//             </a>
//           </div>
//         </div>
//         {bioregistryCollection.description && (
//           <div className="mt-2 p-4 border-1 bg-light rounded">
//             <p className="text-justify">
//               <ReactMarkdown>{bioregistryCollection.description}</ReactMarkdown>
//             </p>
//           </div>
//         )}
//         {renderAuthors()}
//         {renderOrgs()}
//         {renderReferences()}
//       </div>
//     </div>
//   );
// };

export default CollectionPage;
