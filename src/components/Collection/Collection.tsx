import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../layout/collectionList.css";
import { getCollectionsAndThierOntologies } from "../../api/collection";
import collectionsInfoJson from "../../assets/collectionsText.json";
import Toolkit from "../../Libs/Toolkit";
import CommonUrlFactory from "../../UrlFactory/CommonUrlFactory";
import * as SiteUrlParamNames from "../../UrlFactory/UrlParamNames";
import { Link } from "react-router-dom";
import { CollectionJsonData } from "./types";

type CollectionsData = Record<string, CollectionJsonData>;

const DEFAULT_VISIBLE_ONTOLOGIES = 8;

type CollectionOntologyListProps = {
  ontologies: JSX.Element[];
  isLoading: boolean;
};

const CollectionOntologyList = ({
  ontologies,
  isLoading,
}: CollectionOntologyListProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOntologies = showAll
    ? ontologies
    : ontologies.slice(0, DEFAULT_VISIBLE_ONTOLOGIES);
  const hiddenCount = ontologies.length - DEFAULT_VISIBLE_ONTOLOGIES;

  if (isLoading) {
    return (
      <span className="collection-ontologies-loading">
        Loading ontologies ...
      </span>
    );
  }

  return (
    <>
      {visibleOntologies}
      {hiddenCount > 0 && (
        <button
          type="button"
          className="collection-ontologies-toggle"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
};

const Collections = () => {
  const collectionsWithOntologiesQuery = useQuery({
    queryKey: ["allCollectionsWithTheirOntologiesInCollectionPage"],
    queryFn: getCollectionsAndThierOntologies,
  });

  let collectionOntologiesData: { [key: string]: JSX.Element[] } = {};
  if (collectionsWithOntologiesQuery.data) {
    let collectionsWithTheirOntologies = collectionsWithOntologiesQuery.data;
    for (let col in collectionsWithTheirOntologies) {
      collectionOntologiesData[col] = [];
      for (let onto of collectionsWithTheirOntologies[col]) {
        collectionOntologiesData[col].push(
          <Link
            key={onto.ontologyId}
            to={
              process.env.REACT_APP_PROJECT_SUB_PATH +
              "/ontologies/" +
              onto.ontologyId
            }
            className="ontologies-link-tag ontology-button"
            onClick={() => {
              Toolkit.selectSiteNavbarOption("Ontologies");
            }}
          >
            {onto.ontologyId}
          </Link>,
        );
      }
    }
  }
  const collectionOntologies = collectionOntologiesData;
  const ontologiesAreLoading =
    collectionsWithOntologiesQuery.isLoading &&
    !collectionsWithOntologiesQuery.data;

  function createCollectionCard(
    collectionId: string,
    collectionJson: CollectionJsonData,
  ): JSX.Element {
    let collectionPageUrl =
      process.env.REACT_APP_PROJECT_SUB_PATH + "/collections/";
    collectionPageUrl += collectionJson.id.replaceAll(" ", "_").toLowerCase();
    return (
      <div
        className="row collection-card-row"
        key={collectionId}
        id={"section_" + collectionJson["html_id"]}
      >
        <div className="col-sm-3 text-center" key={collectionId + "_logo"}>
          <Link
            to={
              process.env.REACT_APP_PROJECT_SUB_PATH +
              collectionJson["ontology_list_url"]
            }
            className="collection-image-anchor"
          >
            <img
              className="collection-logo-in-list img-fluid p-0"
              alt="logo"
              src={collectionJson["logo"]}
              width={collectionJson["logo_width"] ?? 250}
              height={collectionJson["logo_height"] ?? 130}
            />
          </Link>
        </div>
        <div className="col-sm-9 collection-content">
          <div className="row" key={collectionId + "_name"}>
            <div className="col-sm-12">
              <Link to={collectionPageUrl}>
                <h4>{collectionJson["name"]}</h4>
              </Link>
            </div>
          </div>
          <div className="row" key={collectionId + "_content"}>
            <div className="col-sm-12">
              <p className="text-justify">
                <div
                  dangerouslySetInnerHTML={{ __html: collectionJson["text"] }}
                ></div>
              </p>
            </div>
          </div>
          {collectionJson["project_homepage"] && (
            <div className="row" key={collectionId + "_projectUrl"}>
              <div className="col-sm-12 collection-ontologies-text">
                <b>Project Homepage: </b>
                <a
                  href={collectionJson["project_homepage"]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {collectionJson["project_homepage"]}
                </a>
              </div>
            </div>
          )}
          {collectionJson["domain_ts_link"] && (
            <div className="row" key={collectionId + "_domainLink"}>
              <div className="col-sm-12 collection-ontologies-text">
                <b>Domain-specific terminology service: </b>
                <a
                  href={collectionJson["domain_ts_link"]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {collectionJson["domain_ts_link"]}
                </a>
              </div>
            </div>
          )}
          {collectionJson["selection_criteria"] && (
            <div className="row" key={collectionId + "_ontoList"}>
              <div className="col-sm-12 collection-ontologies-text">
                <b>Ontology Selection Criteria:</b>
                <div
                  dangerouslySetInnerHTML={{
                    __html: collectionJson["selection_criteria"],
                  }}
                ></div>
              </div>
            </div>
          )}
          <div className="row" key={collectionId + "_ontoList"}>
            <div className="col-sm-12 collection-ontologies-text">
              <b>
                Ontologies{" "}
                {!ontologiesAreLoading &&
                  "(" + (collectionOntologies[collectionId] || []).length + ")"}
                :
              </b>
              <span className="collection-ontologies-list">
                <CollectionOntologyList
                  ontologies={collectionOntologies[collectionId] || []}
                  isLoading={ontologiesAreLoading}
                />
              </span>
              <Link
                className="btn btn-sm btn-secondary collection-suggest-ontology-btn"
                to={
                  process.env.REACT_APP_PROJECT_SUB_PATH +
                  "/ontologysuggestion?col=" +
                  collectionId
                }
                onClick={() => {
                  Toolkit.selectSiteNavbarOption("Ontologies");
                }}
              >
                Suggest an ontology for this collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function createCollectionList() {
    let result: JSX.Element[] = [];
    let collectionsInfo = collectionsInfoJson as CollectionsData;
    Object.entries(collectionsInfo).forEach(([col, collectionJson]) => {
      result.push(createCollectionCard(col, collectionJson));
    });

    return result;
  }

  useEffect(() => {
    let urlFactory = new CommonUrlFactory();
    let targetCollectionId = urlFactory.getParam({
      name: SiteUrlParamNames.CollectionId,
    });
    if (
      targetCollectionId &&
      document.getElementById("section_" + targetCollectionId)
    ) {
      document
        .getElementById("section_" + targetCollectionId)!
        .scrollIntoView();
    }
  }, []);

  return (
    <>
      {Toolkit.createHelmet("Collections")}
      <div className="row">
        <div className="col-sm-12 collections-info-container">
          {createCollectionList()}
        </div>
      </div>
    </>
  );
};

export default Collections;
