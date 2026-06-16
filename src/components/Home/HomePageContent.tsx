import collectionsInfoJson from "../../assets/collectionsText.json";
import { Link } from "react-router-dom";
import { CollectionJsonData } from "../Collection/types";

type CollectionsData = Record<string, CollectionJsonData>;

const RenderHomePage = () => {
  return (
    <div className="general-home-page-content">
      <br />
      <div className="row">
        <div>
          <p className="fs-4 fw-bold">TIB Terminology Service</p>
          <p>
            With the Terminology Service, TIB – Leibniz Information Centre for
            Science and Technology and University Library provides a single
            point of access to terminologies from domains such as architecture,
            chemistry, computer science, mathematics and physics. You can browse
            ontologies through the website or use its API to retrieve
            terminological information and use it in your technical services.
          </p>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div>
          <h2>Collections</h2>
        </div>
      </div>
      <br></br>
      <div className="row home-collection-grid">
        {Object.keys(collectionsInfoJson).map((collectionId, index) => {
          return (
            <div
              className={
                "col-12 col-md-6 col-lg-4 mb-3 " +
                (index === 0 ? "stour-collection-box-in-home" : "")
              }
            >
              <CollectionCard collectionId={collectionId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CollectionCard = ({ collectionId }: { collectionId: string }) => {
  let subPath = process.env.REACT_APP_PROJECT_SUB_PATH;
  const collectionsInfo = collectionsInfoJson as CollectionsData;
  return (
    <div className="collection-card text-center">
      {collectionId === "FID BAUdigital" && (
        <div
          className="alert alert-warning text-danger p-0"
          style={{ position: "absolute", zIndex: 10 }}
        >
          Deprecated
        </div>
      )}
      <Link
        to={subPath + collectionsInfo[collectionId]["ontology_list_url"]}
        className="collection-image-anchor"
      >
        <img
          className="img-fluid"
          alt="collection_logo"
          src={collectionsInfo[collectionId]["logo"]}
          loading="lazy"
          style={{
            height: collectionsInfo[collectionId]["logo_height"] ?? 200,
            width: collectionsInfo[collectionId]["logo_width"] ?? 300,
          }}
        />
      </Link>
      <div className="collection-card-text">
        <p className="trunc">{collectionsInfo[collectionId]["text"]}</p>
        <Link
          to={
            subPath +
            "/collections?col=" +
            collectionsInfo[collectionId]["html_id"]
          }
          className="show-more-text-link"
        >
          [Read More]
        </Link>
      </div>
    </div>
  );
};

export default RenderHomePage;
