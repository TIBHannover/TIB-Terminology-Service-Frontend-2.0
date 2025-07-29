import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const SiteNavbar = () => {
  
  const urlPath = window.location.pathname;
  let basePath = process.env.REACT_APP_PROJECT_SUB_PATH;
  
  function handleClick(e) {
    let clickedElement = document.getElementsByClassName("nav-clicked");
    if (clickedElement.length !== 0) {
      clickedElement[0].classList.remove("nav-clicked");
    }
    e.target.classList.add("nav-clicked");
  }
  
  
  return (
    <div className='col-lg-7 col-md-6'>
      <Navbar collapseOnSelect expand="lg" className="site-navbar">
        <Container>
          <Navbar.Toggle aria-controls="siteMainNavbar" className="ms-auto">
            <i className="fa fa-bars collpase-btn-content"></i>
          </Navbar.Toggle>
          <Navbar.Collapse id="siteMainNavbar">
            <Nav className="ms-auto flex-wrap">
              <Nav.Link key={1}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item " + ((urlPath === "/ts" || urlPath === "/ts/") ? "nav-clicked" : "")}
                      to={basePath + "/"}>Home</Link>
              </Nav.Link>
              {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
                <Nav.Link key={2}>
                  <Link onClick={handleClick}
                        className={"nav-link navbar-item stour-collections-navbar-item  " + (urlPath.includes("/collections") ? "nav-clicked" : "")}
                        to={basePath + "/collections"}>Collections</Link>
                </Nav.Link>
              }
              <Nav.Link className="nav-item second-step" key={3}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item stour-ontologies-navbar-item  " + (urlPath.includes("/ontologies") ? "nav-clicked" : "")}
                      to={basePath + "/ontologies"}>Ontologies</Link>
              </Nav.Link>
              <Nav.Link key={4}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item stour-help-navbar-item  " + (urlPath.includes("/help") ? "nav-clicked" : "")}
                      to={basePath + "/help"}>Help</Link>
              </Nav.Link>
              {process.env.REACT_APP_PROJECT_ID !== "nfdi4ing" &&
                <Nav.Link key={5}>
                  <Link onClick={handleClick}
                        className={"nav-link navbar-item stour-api-navbar-item " + (urlPath.includes("/api") ? "nav-clicked" : "")}
                        to={basePath + "/api"}>API</Link>
                </Nav.Link>
              }
              {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <Nav.Link key={6}>
                  <Link onClick={handleClick}
                        className={"nav-link navbar-item " + (urlPath.includes("/docs") ? "nav-clicked" : "")}
                        to={basePath + "/docs"}>Documentation</Link>
                </Nav.Link>
              }
              {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <Nav.Link key={7}>
                  <Link onClick={handleClick}
                        className={"nav-link navbar-item " + (urlPath.includes("/usage") ? "nav-clicked" : "")}
                        to={basePath + "/usage"}>Usage</Link>
                </Nav.Link>
              }
              <Nav.Link key={8}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item stour-about-navbar-item  " + (urlPath.includes("/about") ? "nav-clicked" : "")}
                      to={basePath + "/about"}>About</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
  
}

export default SiteNavbar;