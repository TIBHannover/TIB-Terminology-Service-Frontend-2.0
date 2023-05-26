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
                    <center>What is this service for?</center>
                  </b>
                </h4>
              </div>
              <div>
              <Carousel variant="dark" controls={true} nextIcon="" prevIcon="">
                <Carousel.Item interval={15000}>
                <p>NFDI4Ing Terminology Service is a repository for ontologies in the broad engineering domain. It aims to serve as a central access point to the latest ontology versions. Most of the ontologies in our service are managed in various Git repositories such as GitLab or GitHub. Only a few of them are still managed on self-hosted web servers.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>1) Search, Browse and Filter for Terminologies:</b> All available terminologies can be displayed, searched, sorted or found via free-text search queries. The results list already offers a preview of the terminology, such as a short description, the number of classes and properties, and the date it was last loaded.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>2) Display Metadata:</b> Additional information about the terminologies is bundled and clearly presented with every terminology. This allows the user to see e.g. information about licence, creators, and homepage. Furthermore, the original resource can be downloaded to the local computer.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>3) Human and machine interaction is supported:</b> All information managed in the service can be consumed via the frontend. In addition to the frontend, we provide an interface for machine-to-machine communication via our REST interface. To familiarise yourself with our REST interface, you can take a look at our <a
                  className="ahome"
                  href="https://service.tib.eu/ts4tib/swagger-ui.html"
                >
                  Swagger Documentation
                </a>.</p>
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
                    <center>Who uses the Service?</center>
                  </b>
                </h4>
              </div>
              <Carousel variant="dark" controls={true}  nextIcon="" prevIcon="">
                <Carousel.Item interval={15000}>
                <p>In principle everyone that works with a need for the use of unambiguous language. Like organisations and institutions or in science and research. The NFDI4Ing Terminology Services is a free offer that everyone can use via this frontend or our REST machine-to-machine communication interface. The <a
                  className="ahome"
                  href={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}
                >
                  Documentation
                </a> is available here.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>1) Science and Research:</b> Among other things, for the development of innovative data and knowledge management systems (research data management, publishing), as a source for training new language models (natural language processing) and much more. Researchers will find terminologies here that cover many facets of the broad field of engineering.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>2) Industry:</b> In situations where a common vocabulary needs to be found and agreed upon. For example, in text editors that support engineers in the creation of technical specifications or reports. In medicine for the unambiguous designation of diseases, symptoms or therapies, but also for the billing system. The use of a controlled vocabulary enables high expressiveness.</p>
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
              <Carousel variant="dark" controls={true} nextIcon="" prevIcon="">
              <Carousel.Item interval={15000}>
              <p>The NFDI4Ing Terminology Service is used by various tools and services already. In addition, it has been used to train Named Entity Recognition models for a series of experiments. We look forward to every message that shows us where the service is also used.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Application Profile Service:</b> An application profile is a set of requirements for subject and use-case specific metadata. In the <a
                  className="ahome"
                  href="https://www.aims-projekt.de/"
                >
                  AIMS
                </a> frontend users can search and drag vocabulary terms into their application profile. The Terminology Service is used to retrieve these vocabulary terms, by automatically querying its REST Interface.</p>
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
                </a> TermClick is a browser extension that allows you to highlight text within a web page and look up its meaning in the NFDI4Ing Terminology Service. TermClick is configurable to groups or specific individual terminologies.  Currently, the plugin is only available for the FireFox browser, but it will be migrated to other browsers as well.</p>
                <br/>
                </Carousel.Item>
                <Carousel.Item interval={15000}>
                <p><b>Research:</b> The REST interface of the service was used, among other things, to iteratively and repeatedly retrieve the contents of specific terminologies in order to train an entity recognition model. This model allows domain-specific entities to be recognised automatically. </p>
                <br/>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
          <center><h3 className="font-weight-bold">Provide New Terminologies or Feedback</h3></center>
              <p>We welcome all contact and feedback. You can simply send us an email to terminology-Service AT tib.eu. To stay informed about the service and its use, please subscribe to our <a href="https://www.linkedin.com/showcase/nfdi4ing-terminology-service/?viewAsMember=true"> <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="linkedin" width="20" height="20"></img> Page</a></p>
        </div>
      </div>
    </div>
  ];

  return content;
}
