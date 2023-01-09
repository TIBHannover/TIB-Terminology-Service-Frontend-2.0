import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
import SearchForm from "../../Search/SearchForm";


function Header () {

  return (
    <div className='header-warpper'>
      <div className='container site-header'>
          <div className='row site-header-top-row'>
            {/* <a href="#">Login</a> */}
          </div>
          <div className='row site-header-nav-logo-holder'>
            <div className='col-lg-4 col-md-6'>
              {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
                <span>
                  <img src="/chem_small_logo.png" alt="nfdi4chem_logo" className='site-logo-image'/>
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>                 
              }
              {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" &&
                <span>
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}><img src="/NFDI4ING_ALT_LOGO.png" alt="NFDI4ING_ALT_LOGO" className='site-logo-image'/></a>
                </span>                 
              }
              {process.env.REACT_APP_PROJECT_ID === "general" && 
                <span>
                  <img src= {TIB_Logo} alt="tib logo" height={60} width={80} /> 
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>
              }              
            </div>
            <Navbar />
          </div>
          <div className='row justify-content-center site-header-searchbox-holder'>
            <SearchForm />
          </div>
      </div>
    </div>
  )
}

export default Header;