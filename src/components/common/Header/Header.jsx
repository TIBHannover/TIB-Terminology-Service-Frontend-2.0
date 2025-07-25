import SiteNavbar from '../Navbar/Navbar';
import SearchForm from '../../Search/SearchForm/SearchForm';
import UserPanel from '../../User/Login/UserPanel';


function Header() {
  return (
    <>
      <div className='row header-wrapper header-collapseable-section'>
        <div className='row'>
          <div className='col-xl-11 text-end m-auto'>
            <UserPanel isModal={true}></UserPanel>
          </div>
        </div>
        <div className='col-sm-10 site-header'>
          <div className='row site-header-nav-logo-holder'>
            <div className='col-lg-4 col-md-6'>
              {process.env.REACT_APP_PROJECT_ID === "general" &&
                <span>
                  <img src="/TIB_Logo_W_W.SVG" alt="tib logo" height={60} width={80} loading="lazy"/>
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>
              }
              {process.env.REACT_APP_PROJECT_ID !== "nfdi4chem" && process.env.REACT_APP_PROJECT_ID !== "general" &&
                <span>
                  <img src="/site_logo.png" alt="site_logo" className='site-logo-image' loading="lazy"/>
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>
              }
              {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
                <span>
                  <img src="/site_logo.webp" alt="site_logo" className='site-logo-image' loading="lazy"/>
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>
              }
            </div>
            <SiteNavbar/>
          </div>
          <SearchForm/>
        </div>
      </div>
    </>
  )
}

export default Header;