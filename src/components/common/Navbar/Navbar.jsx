import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';

const SiteNavbar = () => {

  const urlPath = window.location.pathname;
  let basePath = process.env.REACT_APP_PROJECT_SUB_PATH;

  function handleClick(e) {
    let clickedElement = document.getElementsByClassName("nav-clicked");
    if (clickedElement.length !== 0) {
      clickedElement[0].classList.remove("nav-clicked");
    }
    e.currentTarget.classList.add("nav-clicked");
  }


  return (
    <div className='mt-0'>
      <Navbar collapseOnSelect expand="lg" className="site-navbar">
        <Container>
          <Navbar.Toggle aria-controls="siteMainNavbar" className="ms-auto  navbar-burger-menu">
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
              {process.env.REACT_APP_TERMSET_FEATURE === "true" &&
                <Nav.Link key={5}>
                  <Link onClick={handleClick}
                    className={"nav-link navbar-item " + (urlPath.includes("/termsets") ? "nav-clicked" : "")}
                    to={basePath + "/termsets"}>Termsets</Link>
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
              <NavDropdown
                title="info"
                id="site-navbar-info-dropdown"
                className={"nav-link navbar-item nav-dropdown-title " + (urlPath.includes("/about") || urlPath.includes("/help") || urlPath.includes("/docs") || urlPath.includes("/contact") ? "nav-clicked" : "")} onClick={handleClick}
              >
                <NavDropdown.Item key={"1"}>
                  <Link
                    className={"nav-link navbar-item-dropdown stour-about-navbar-item"}
                    to={basePath + "/about"}>About
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item key={"2"}>
                  <Link
                    className={"nav-link navbar-item-dropdown  stour-help-navbar-item"}
                    to={basePath + "/help"}>Help
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link
                    className={"nav-link navbar-item-dropdown  stour-help-navbar-item"}
                    to={basePath + "/docs"}>Documentation
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link
                    className={"nav-link navbar-item-dropdown  stour-help-navbar-item"}
                    to={basePath + "/contact"}>Contact us
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )

}

export default SiteNavbar;