import collectionsInfoJson from '../../assets/collectionsText.json';
import { Link } from 'react-router-dom';

const RenderHomePage = () => {
  return [
    <div className="general-home-page-content">
      <br />
      <div className="row">
        <div>
          <h2>TIB Terminology Service</h2>
          <p>
            With the Terminology Service, TIB – Leibniz Information Centre for Science and Technology and University
            Library provides a single point of access to terminologies from domains such as
            architecture, chemistry, computer science, mathematics and physics. You can browse ontologies through the
            website or use its API to retrieve terminological information and use it in your
            technical services.
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
      <div className="row">
        {Object.keys(collectionsInfoJson).map((collectionId, index) => {
          return (
            <div className={"col-12 col-lg-4 mb-3 " + (index === 0 ? "stour-collection-box-in-home" : "")}>
              <CollectionCard collectionId={collectionId} />
            </div>
          );
        })}
      </div>
    </div>,
  ];
}


const CollectionCard = ({ collectionId }) => {
  let subPath = process.env.REACT_APP_PROJECT_SUB_PATH;
  return (
    <div className="collection-card text-center">
      {collectionId === "FID BAUdigital" && <div className="alert alert-warning text-danger p-0" style={{ position: 'absolute', zIndex: 10 }}>Deprecated</div>}
      <Link to={subPath + collectionsInfoJson[collectionId]['ontology_list_url']} className="collection-image-anchor">
        <img
          className="img-fluid p-5"
          alt="collection_logo"
          src={collectionsInfoJson[collectionId]['logo']}
          loading="lazy"
          style={{
            height: collectionsInfoJson[collectionId]["logo_height"] ?? 200,
            width: collectionsInfoJson[collectionId]["logo_width"] ?? 300
          }}

        />
      </Link>
      <div className="collection-card-text">
        <p className="trunc">{collectionsInfoJson[collectionId]['text']}</p>
        <Link to={subPath + '/collections?col=' + collectionsInfoJson[collectionId]['html_id']}
          className="show-more-text-link">
          [Read More]
        </Link>
      </div>
    </div>
  );
}

export default RenderHomePage;


