import collectionsInfoJson from "../../assets/collectionsText.json";


export function createHomePageContent(readMoreClickHandler){    
    let content = [
      <div className="container home-page-content-container">
        <div className="row">
          <div className="col-sm-12">
              <h2>TIB Terminology Service</h2>
              <p>
                  With its new Terminology Service, TIB – Leibniz Information Centre for Science and Technology
                  and University Library provides a single point of access to terminology from domains such as architecture,
                  chemistry, computer science, mathematics and physics. You can browse ontologies through the website or use its API
                  to retrieve terminological information and use it in your technical services. Layout template for TIB General. 
              </p>              
              <p>
                Examples: <a href='/search?q=oxidation'>Oxidation</a>, <a href='/search?q=IAO_0020000'>IAO_0020000</a>
              </p>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-12">
            <h2>Collections</h2>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="NFDI4Ing" src={collectionsInfoJson["NFDI4Ing"]["logo"]}  />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["NFDI4Ing"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="NFDI4Chem" src={"/" + collectionsInfoJson["NFDI4Chem"]["logo"]} />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["NFDI4Chem"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="CoyPu"  src={collectionsInfoJson["CoyPu"]["logo"]}  />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["CoyPu"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="FAIR Data Spaces"  src={"/" + collectionsInfoJson["FAIR Data Spaces"]["logo"]} />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["FAIR Data Spaces"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="FID Move"  src={collectionsInfoJson["FID Move"]["logo"]}  />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["FID Move"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="collection-card">
              <a href="#" className="collection-image-anchor">
                  <img class="img-fluid collection-logo" alt="FID Baudigital"  src={"/" + collectionsInfoJson["FID Baudigital"]["logo"]} />
              </a>
              <div className="collection-card-text trunc">
                <p>{collectionsInfoJson["FID Baudigital"]["text"]}</p>
              </div>
              <a className="btn btn-primary" onClick={readMoreClickHandler}>Read More</a>
            </div>
          </div>
        </div>
      </div> 
    ];
    
    return content;
} 