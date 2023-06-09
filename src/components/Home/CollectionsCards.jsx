import collectionsInfoJson from '../../assets/collectionsText.json';

export function createHomePageContent() {
  let content = [
    <div className="general-home-page-content">
      <br />
      <div className="row">
        <div>
          <h2>TIB Terminology Service</h2>
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
      <div className="row">
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['NFDI4Ing']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo"
                alt="NFDI4Ing"
                src={collectionsInfoJson['NFDI4Ing']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">{collectionsInfoJson['NFDI4Ing']['text']}</p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' +
                  collectionsInfoJson['NFDI4Ing']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['NFDI4Chem']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo"
                alt="NFDI4Chem"
                src={collectionsInfoJson['NFDI4Chem']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">
                {collectionsInfoJson['NFDI4Chem']['text']}
              </p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' +
                  collectionsInfoJson['NFDI4Chem']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div className="row">
      <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['NFDI4Culture']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo nfdi4culture-logo"
                alt="NFDI4Culture"
                src={collectionsInfoJson['NFDI4Culture']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">{collectionsInfoJson['NFDI4Culture']['text']}</p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collectionsInfoJson['NFDI4Culture']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['CoyPu']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo coypu-logo"
                alt="CoyPu"
                src={collectionsInfoJson['CoyPu']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">{collectionsInfoJson['CoyPu']['text']}</p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' + collectionsInfoJson['CoyPu']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['FID Move']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo"
                alt="FID Move"
                src={collectionsInfoJson['FID Move']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">{collectionsInfoJson['FID Move']['text']}</p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' +
                  collectionsInfoJson['FID Move']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['FID Baudigital']['ontology_list_url']}
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo"
                alt="FID Baudigital"
                src={collectionsInfoJson['FID Baudigital']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">
                {collectionsInfoJson['FID Baudigital']['text']}
              </p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' +
                  collectionsInfoJson['FID Baudigital']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col-sm-6">
          <div className="collection-card">
            <a
              href={
                process.env.REACT_APP_PROJECT_SUB_PATH + collectionsInfoJson['FAIR Data Spaces']['ontology_list_url']
              }
              className="collection-image-anchor"
            >
              <img
                className="img-fluid collection-logo"
                alt="FAIR Data Spaces"
                src={collectionsInfoJson['FAIR Data Spaces']['logo']}
              />
            </a>
            <div className="collection-card-text">
              <p className="trunc">
                {collectionsInfoJson['FAIR Data Spaces']['text']}
              </p>
              <a
                href={
                  process.env.REACT_APP_PROJECT_SUB_PATH + '/collections?col=' +
                  collectionsInfoJson['FAIR Data Spaces']['html_id']
                }
                className="show-more-text-link"
              >
                [Read More]
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ];

  return content;
}
