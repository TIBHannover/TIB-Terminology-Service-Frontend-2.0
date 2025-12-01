import SiteNavbar from '../Navbar/Navbar';
import SearchForm from '../../Search/SearchForm/SearchForm';
import UserPanel from '../../User/Login/UserPanel';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <>
      <div className='row header-wrapper header-collapseable-section'>
        <div className="col-sm-12">
          <div className='row'>
            <div className='col-12 col-md-3'>
              <SiteLogo />
            </div>
            <div className='col-6 col-md-6'>
              <div className="row">
                <div className='col-sm-12'>
                  <SiteNavbar />
                </div>
              </div>
            </div>
            <div className='col-6 col-md-3 text-center'>
              <UserPanel isModal={true}></UserPanel>
            </div>
          </div>
          <SearchForm />
        </div>
      </div>
    </>
  )
}

const SiteLogo = () => {
  return (
    <div className='row site-header-nav-logo-holder'>
      <div className=''>
        {process.env.REACT_APP_PROJECT_ID === "general" &&
          <span>
            <Link className="main-title" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>
              <img src={"/TIB_Logo_W_W.SVG"} alt="tib logo" height={60}
                width={80} loading="lazy" />

            </Link>
          </span>
        }
        {process.env.REACT_APP_PROJECT_ID !== "nfdi4chem" && process.env.REACT_APP_PROJECT_ID !== "general" &&
          <span>
            <Link className="main-title" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>
              <img src="/site_logo.png" alt="site_logo" className='site-logo-image' loading="lazy" />
            </Link>
          </span>
        }
        {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" &&
          <span>
            <Link className="main-title" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>
              <img src="/site_logo.webp" alt="site_logo" className='site-logo-image' loading="lazy" />
            </Link>
          </span>
        }
      </div>
    </div>
  )
}

export default Header;