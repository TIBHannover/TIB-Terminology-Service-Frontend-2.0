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
              <Carousel variant="dark" controls={false}>
                <Carousel.Item interval={15000}>
                <p><small>In principle everyone that works with a need for the use of unambiguouslanguage. Like organisations and institutions or in science and research. The NFDI4Ing Terminology Services is a free service offer that everyone can use via this frontend or our REST machine-to-machine communication interface.</small></p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Science and Research:</b> Among other things, for the development of innovative data and knowledge management systems (research data management, publishing), as a source for training new language models (natural language processing) and much more.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Industry:</b> I order to find and agree on a common vocabulary. E.g. in medicine for the clear designation of diseases, symptoms or therapies, but also for the billing system.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Organisations and Institutions:</b> As a reference source for a clear labeling system. Among other things ….</p>
                <br/>
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
                    <center>What can this Service do for me?</center>
                  </b>
                </h4>
              </div>
              <Carousel variant="dark" controls={false}>
                <Carousel.Item interval={15000}>
                <p>In principle everyone that works with a need for the use of unambiguous language. Like organisations and institutions or in science and research. The <a
                  className="ahome"
                  href={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}
                >
                  NFDI4Ing Terminology Service
                </a>{" "} is a free service offer that everyone can use via this frontend or our REST machine-to-machine communication interface.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Search, Browse and Filter for Terminologies:</b> All available terminologies can be displayed and searched sorted or found via free text search. Results can be restricted by means of filters.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Display Metadata:</b> The relationships between the components of a selected terminology are presented visually and can be searched interactively.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Human and machine interaction is supported:</b> All information managed in the service can be consumed via the human explorable website. Machine to machine communication is supported via our REST interface.</p>
                <br/>
                </Carousel.Item>
              </Carousel>
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
                    <center>Where is the Service in use?</center>
                  </b>
                </h4>
              </div>
              <Carousel variant="dark" controls={false}>
                <Carousel.Item interval={15000}>
                <p><b>Application Profile Service:</b> The AIMS project focuses on the creation and sharing of metadata standards as so-called application profiles. An application profile is a set of requirements for subject and use-case specific metadata and represented in RDF and SHACL. Within the frontend, users can search and drag vocabulary terms into their application profile as properties and define options about them. The Terminology Service is used to retrieve these vocabulary terms, by automatically querying its REST Interface.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><a
                  className="ahome"
                  href="https://orkg.org/"
                >
                  ORKG:
                </a> The Open Research Knowledge Graph (ORKG) aims to describe research papers in a structured manner. With the ORKG, papers are easier to find and compare. </p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><a
                  className="ahome"
                  href="https://addons.mozilla.org/en-US/firefox/addon/termclick/"
                >
                  Termclick:
                </a> Is a browser extension that makes it possible to mark text within web pages and look up their meaning in the Terminology Service. TermClick can be configured for groups or specific individual terminologies.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Research:</b> The REST interface of the service was used, among other things, to iteratively and repeatedly query the contents of certain terminologies for each experiment in order to train a domain-specific entity extraction and linking procedure. </p>
                <br/>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ];

  return content;
}
