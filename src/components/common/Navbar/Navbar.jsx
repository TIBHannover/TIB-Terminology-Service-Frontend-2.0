
import { Link } from 'react-router-dom';

function Navbar() {

  let urlPath = window.location.pathname;
  return (
    <div className='col-lg-7 col-md-6'>
      <nav className="navbar navbar-expand-xl site-navbar">
        <button className="navbar-toggler navbar-collapse-btn" type="button" data-toggle="collapse" data-target="#siteMainNavbar">
          <i className="fa fa-bars collpase-btn-content"></i>
        </button>
        <div className="collapse navbar-collapse" id="siteMainNavbar">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item" key={1}>
              {urlPath === "/" || urlPath === "/ts"
                ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>Home</Link>
                : <Link className="nav-link navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>Home</Link>
              }
            </li>
            {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
              <li className="nav-item" key={2}>
                {urlPath.includes("/collections")
                  ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"}>Collections</Link>
                  : <Link className="nav-link navbar-item stour-collections-navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"}>Collections</Link>
                }
              </li>
            }
            <li className="nav-item second-step" key={3}>
              {urlPath.includes("/ontologies")
                ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"}>Ontologies</Link>
                : <Link className="nav-link navbar-item stour-ontologies-navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"}>Ontologies</Link>
              }
            </li>
            <li className="nav-item" key={4}>
              {urlPath.includes("/help")
                ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"}>Help</Link>
                : <Link className="nav-link navbar-item stour-help-navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"}>Help</Link>
              }
            </li>
            {process.env.REACT_APP_PROJECT_ID !== "nfdi4ing" &&
              <li className="nav-item" key={5}>
                {urlPath.includes("/api")
                  ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"}>API</Link>
                  : <Link className="nav-link navbar-item stour-api-navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"}>API</Link>
                }
              </li>
            }
            {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
              <li className="nav-item" key={6}>
                {urlPath.includes("/docs")
                  ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}>Documentation</Link>
                  : <Link className="nav-link navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}>Documentation</Link>
                }
              </li>
            }
            {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
              <li className="nav-item" key={7}>
                {urlPath.includes("/usage")
                  ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"}>Usage</Link>
                  : <Link className="nav-link navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"}>Usage</Link>
                }
              </li>
            }
            <li className="nav-item" key={8}>
              {urlPath.includes("/about")
                ? <Link className="nav-link navbar-item nav-clicked" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"}>About</Link>
                : <Link className="nav-link navbar-item stour-about-navbar-item" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"}>About</Link>
              }
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )

}

export default Navbar;