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
        <div className="col-sm-6">
          <CollectionCard  collectionId={'NFDI4Ing'} />
        </div>
        <div className="col-sm-6">
          <CollectionCard collectionId={'NFDI4Chem'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard collectionId={'NFDI4Culture'} />
        </div>
        <div className="col-sm-6">
          <CollectionCard collectionId={'CoyPu'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard collectionId={'FID Move'} />
        </div>
        <div className="col-sm-6">
          <CollectionCard  collectionId={'FID Baudigital'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard collectionId={'FAIR Data Spaces'}  />
        </div>
        <div className="col-sm-6">
          <CollectionCard collectionId={'NFDI4Cat'} />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard  collectionId={'ESS'} />
        </div>
        <div className="col-sm-6">
          <CollectionCard collectionId={'NFDI4ENERGY'} />
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard collectionId={'DataPLANT'}  />
        </div>
        <div className="col-sm-6">
          <CollectionCard collectionId={'Educational Resources'}  />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-6">
          <CollectionCard collectionId={'Foundational Ontologies'} />
        </div>
      </div>
    </div>,
  ];
}




const CollectionCard = ({collectionId}) => {
  let subPath = process.env.REACT_APP_PROJECT_SUB_PATH;
  return(
    <div className="collection-card">
      <a href={subPath + collectionsInfoJson[collectionId]['ontology_list_url']} className="collection-image-anchor" target='_blank'>
        <img className="img-fluid collection-logo" alt="NFDI4Ing" src={collectionsInfoJson[collectionId]['logo']} />
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


