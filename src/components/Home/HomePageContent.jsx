import collectionsInfoJson from '../../assets/collectionsText.json';

export function renderHomePage() {
  return [
    <div className="general-home-page-content">
      <br />
      <div className="row">
        <div>
          <h2>TIB Terminology Service</h2>
          <p>
            With the Terminology Service, TIB – Leibniz Information Centre for Science and Technology and University Library provides a single point of access to terminologies from domains such as
            architecture, chemistry, computer science, mathematics and physics. You can browse ontologies through the website or use its API to retrieve terminological information and use it in your
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
        <div className="col-sm-4 stour-collection-box-in-home">
          <CollectionCard collectionId={'NFDI4ING'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'NFDI4CHEM'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'NFDI4CULTURE'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-4">
          <CollectionCard collectionId={'CoyPu'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'FID move'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'FID BAUdigital'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-4">
          <CollectionCard collectionId={'FAIR Data Spaces'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'ESS'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'NFDI4CAT'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-4">
          <CollectionCard collectionId={'NFDI4Energy'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'DataPLANT'} />
        </div>
        <div className="col-sm-4">
          <CollectionCard collectionId={'Educational Resources'} />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-4">
          <CollectionCard collectionId={'Foundational Ontologies'} />
        </div>
      </div>
    </div>,
  ];
}




const CollectionCard = ({ collectionId }) => {
  let subPath = process.env.REACT_APP_PROJECT_SUB_PATH;
  return (
    <div className="collection-card">
      <a href={subPath + collectionsInfoJson[collectionId]['ontology_list_url']} className="collection-image-anchor" target='_blank'>
        <img className="img-fluid collection-logo" alt="collection_logo" src={collectionsInfoJson[collectionId]['logo']} />
      </a>
      <div className="collection-card-text">
        <p className="trunc">{collectionsInfoJson[collectionId]['text']}</p>
        <a href={subPath + '/collections?col=' + collectionsInfoJson[collectionId]['html_id']} className="show-more-text-link" target='_blank'>
          [Read More]
        </a>
      </div>
    </div>
  );
}


