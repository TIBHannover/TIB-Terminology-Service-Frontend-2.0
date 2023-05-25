import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";

export function nfdi4ingHomePage() {
  let content = [
    <div className="row justify-content-center">
      <div className="col-sm-8">
        <div className="row">
          <div className="col-sm-4">
            <a href="#" className="d-block">
              <img
                className="img-fluid home-image"
                alt="Blog image"
                src="/about.svg"
              />
            </a>
            <div className="p-3">
              <div className="font-weight-bold mb-2">
                <h4>
                  <b>
                    <center>Who uses the Service?</center>
                  </b>
                </h4>
              </div>
              <div>
              <Carousel variant="dark">
                <Carousel.Item interval={15000}>
                  <Carousel.Caption>
                    {/* <h3>Label for first slide</h3> */}
                    <p><small>In principle everyone that works with a need for the use of unambiguous language. Like organisations and institutions or in science and research. The NFDI4Ing Terminology Services is a free service offer that everyone can use via this frontend or our REST machine-to-machine communication interface.</small></p>
                  </Carousel.Caption>
                  <img
                    className="d-block wh-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/512px-Solid_white.svg.png?20220303184432"
                    alt="Image One"
                  />
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                  <Carousel.Caption>
                    {/* <h3>Label for second slide</h3> */}
                    <p><b>Science and Research</b> Among other things, for the development of innovative data and knowledge management systems (research data management, publishing), as a source for training new language models (natural language processing) and much more.</p>
                  </Carousel.Caption>
                  <img
                    className="d-block wh-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/512px-Solid_white.svg.png?20220303184432"
                    alt="Image Two"
                  />
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                  <Carousel.Caption>
                    
                    <p><b>Industry</b> I order to find and agree on a common vocabulary. E.g. in medicine for the clear designation of diseases, symptoms or therapies, but also for the billing system.</p>
                  </Carousel.Caption>
                  <img
                    className="d-block wh-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/512px-Solid_white.svg.png?20220303184432"
                    alt="Image Three"
                  />
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                  <img
                    className="d-block wh-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/512px-Solid_white.svg.png?20220303184432"
                    alt="Image Three"
                  />
                  <Carousel.Caption>
                    
                    <p><b>Organisations and Institutions</b> As a reference source for a clear labeling system. Among other things ….</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <a href="#" className="d-block">
              <img
                className="img-fluid home-image"
                alt="Blog image"
                src="/brainstorm.svg"
              />
            </a>
            <div className="p-3">
              <div className="font-weight-bold mb-2">
                <h4>
                  <b>
                    <center>Community Vision of NFDI4Ing</center>
                  </b>
                </h4>
              </div>
              <p>
                NFDI4Ing Terminology Service is a community driven offer, that
                intends to reflect the interests of engineers (see respective
                DFG Subjects Area) . We appreciate and encourage everyone
                interested to get involved in shaping it by proposing further
                existing ontologies and new features. To make such proposals
                please either write an email to felix.engel (AT) tib.eu or use
                our GitLab issue tracker.
              </p>
            </div>
          </div>
          <div className="col-sm-4">
            <a href="#" className="d-block">
              <img
                className="img-fluid home-image"
                alt="Blog image"
                src="/function.svg"
              />
            </a>
            <div className="p-3">
              <div className="font-weight-bold mb-2">
                <h4>
                  <b>
                    <center>Specifications</center>
                  </b>
                </h4>
              </div>
              <p>
                This service can be used to search for terminologies both
                manually and programmatically. Users can access the extensive
                and interactive metadata of each term from the user interface.
                On the other hand, data repositories or electronic lab notebooks
                can use the comprehensive API to retrieve ontology terms. More
                information can be found on{" "}
                <a
                  className="ahome"
                  href={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}
                >
                  Documentation
                </a>{" "}
                about the usage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ];

  return content;
}
