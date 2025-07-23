import {Link} from 'react-router-dom';

const Navbar = () => {
  
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
      <nav className="navbar navbar-expand-xl site-navbar">
        <button className="navbar-toggler navbar-collapse-btn" type="button" data-toggle="collapse"
                data-target="#siteMainNavbar">
          <i className="fa fa-bars collpase-btn-content"></i>
        </button>
        <div className="collapse navbar-collapse" id="siteMainNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item" key={1}>
              <Link onClick={handleClick}
                    className={"nav-link navbar-item " + ((urlPath === "/ts" || urlPath === "/ts/") ? "nav-clicked" : "")}
                    to={basePath + "/"}>Home</Link>
            </li>
            {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
              <li className="nav-item" key={2}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item stour-collections-navbar-item  " + (urlPath.includes("/collections") ? "nav-clicked" : "")}
                      to={basePath + "/collections"}>Collections</Link>
              </li>
            }
            <li className="nav-item second-step" key={3}>
              <Link onClick={handleClick}
                    className={"nav-link navbar-item stour-ontologies-navbar-item  " + (urlPath.includes("/ontologies") ? "nav-clicked" : "")}
                    to={basePath + "/ontologies"}>Ontologies</Link>
            </li>
            <li className="nav-item" key={4}>
              <Link onClick={handleClick}
                    className={"nav-link navbar-item stour-help-navbar-item  " + (urlPath.includes("/help") ? "nav-clicked" : "")}
                    to={basePath + "/help"}>Help</Link>
            </li>
            {process.env.REACT_APP_PROJECT_ID !== "nfdi4ing" &&
              <li className="nav-item" key={5}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item stour-api-navbar-item " + (urlPath.includes("/api") ? "nav-clicked" : "")}
                      to={basePath + "/api"}>API</Link>
              </li>
            }
            {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
              <li className="nav-item" key={6}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item " + (urlPath.includes("/docs") ? "nav-clicked" : "")}
                      to={basePath + "/docs"}>Documentation</Link>
              </li>
            }
            {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
              <li className="nav-item" key={7}>
                <Link onClick={handleClick}
                      className={"nav-link navbar-item " + (urlPath.includes("/usage") ? "nav-clicked" : "")}
                      to={basePath + "/usage"}>Usage</Link>
              </li>
            }
            <li className="nav-item" key={8}>
              <Link onClick={handleClick}
                    className={"nav-link navbar-item stour-about-navbar-item  " + (urlPath.includes("/about") ? "nav-clicked" : "")}
                    to={basePath + "/about"}>About</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
  
}

export default Navbar;