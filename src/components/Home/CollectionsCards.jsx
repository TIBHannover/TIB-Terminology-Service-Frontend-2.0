import collectionsInfoJson from "../../assets/collectionsText.json";


export function createHomePageContent(){    
    let content = [
      <div className="container home-page-content-container">
        <div className="row">
          <div className="col-sm-12">
              <h3 className="text-dark">TIB Terminology Service</h3>
              <p className="text-justify text-dark text-decoration-none">
                  With its new Terminology Service, TIB – Leibniz Information Centre for Science and Technology
                  and University Library provides a single point of access to terminology from domains such as architecture,
                  chemistry, computer science, mathematics and physics. You can browse ontologies through the website or use its API
                  to retrieve terminological information and use it in your technical services. Layout template for TIB General. 
              </p>
              <br/>
              <p className="text-justify text-dark text-decoration-none h5 mb-0">
                Examples: <a href='/search?q=oxidation'>Oxidation</a>, <a href='/search?q=IAO_0020000'>IAO_0020000</a>
              </p>
              <p></p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h3 className="text-dark">Collections</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="NFDI4Ing" width="700" height="480" src={collectionsInfoJson["NFDI4Ing"]["logo"]}  />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["NFDI4Ing"]["text"]}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="NFDI4Chem" width="700" height="480" src={"/" + collectionsInfoJson["NFDI4Chem"]["logo"]} />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["NFDI4Chem"]["text"]}</p>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="CoyPu" width="700" height="480" src={collectionsInfoJson["CoyPu"]["logo"]}  />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["CoyPu"]["text"]}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="FAIR Data Spaces" width="700" height="480" src={"/" + collectionsInfoJson["FAIR Data Spaces"]["logo"]} />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["FAIR Data Spaces"]["text"]}</p>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="FID Move" width="700" height="480" src={collectionsInfoJson["FID Move"]["logo"]}  />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["FID Move"]["text"]}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid w-100" alt="FID Baudigital" width="700" height="480" src={"/" + collectionsInfoJson["FID Baudigital"]["logo"]} />
              </a>
              <div className="collection-card-text">
                <p>{collectionsInfoJson["FID Baudigital"]["text"]}</p>
              </div>
            </div>
          </div>
        </div>
      </div> 
    ];
    
    return content;
} 