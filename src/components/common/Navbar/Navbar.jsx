function Navbar () {
  let urlPath = window.location.pathname;
  return (
    <div className='col-lg-8 col-md-6'>
         <nav class="navbar navbar-expand-xl site-navbar">   
         <button class="navbar-toggler navbar-collapse-btn" type="button" data-toggle="collapse" data-target="#siteMainNavbar">           
            <i class="fa fa-bars collpase-btn-content"></i>
          </button>  
            <div class="collapse navbar-collapse" id="siteMainNavbar">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                {urlPath === "/" || urlPath === "/ts" 
                  ? <a class="nav-link navbar-item nav-clicked" href="/">Home</a>
                  : <a class="nav-link navbar-item" href="/">Home</a>
                }                  
                </li>
                {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" &&
                <li class="nav-item">
                 {urlPath.includes("/collections") 
                    ? <a class="nav-link navbar-item nav-clicked" href="/collections">Collections</a>
                    : <a class="nav-link navbar-item" href="/collections">Collections</a>
                  }
                </li>
                }
                <li class="nav-item">
                {urlPath.includes("/ontologies") 
                  ? <a class="nav-link navbar-item nav-clicked" href="/ontologies">Ontologies</a>
                  : <a class="nav-link navbar-item" href="/ontologies">Ontologies</a>
                }                  
                </li>
                <li class="nav-item">
                {urlPath.includes("/help") 
                  ? <a class="nav-link navbar-item nav-clicked" href="/help">Help</a>
                  : <a class="nav-link navbar-item" href="/help">Help</a>
                }                  
                </li>
                <li class="nav-item">
                {urlPath.includes("/api") 
                  ? <a class="nav-link navbar-item nav-clicked" href="/api">API</a>
                  : <a class="nav-link navbar-item" href="/api">API</a>
                }                  
                </li>
                {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <li class="nav-item">
                 {urlPath.includes("/usage") 
                    ? <a class="nav-link navbar-item nav-clicked" href="/usage">Usage</a>
                    : <a class="nav-link navbar-item" href="/usage">Usage</a>
                  }
                </li>
                }
                <li class="nav-item">
                {urlPath.includes("/about") 
                  ? <a class="nav-link navbar-item nav-clicked" href="/about">About</a>
                  : <a class="nav-link navbar-item" href="/about">About</a>
                }                  
                </li>
              </ul>
            </div>            
        </nav>
    </div>
  )

}

export default Navbar;