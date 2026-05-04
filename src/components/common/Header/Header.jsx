import SiteNavbar from '../Navbar/Navbar';
import SearchForm from '../../Search/SearchForm/SearchForm';
import UserPanel from '../../User/Login/UserPanel';
import {Link} from 'react-router-dom';


function Header() {
  return (
    <>
      <div className='row header-wrapper header-collapseable-section'>
        <div className="col-sm-12">
          <div className='row'>
            <div className='col-12 col-md-3'>
              <SiteLogo/>
            </div>
            <div className='col-6 col-md-6'>
              <div className="row">
                <div className='col-sm-12'>
                  <SiteNavbar/>
                </div>
              </div>
            </div>
            <div className='col-6 col-md-3 text-center'>
              <UserPanel isModal={true}></UserPanel>
            </div>
          </div>
          <SearchForm/>
        </div>
      </div>
    </>
  )
}

const SiteLogo = () => {
  return (
    <div className='row site-header-nav-logo-holder'>
      <div className=''>
        <span>
            <Link className="main-title" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>
              <img
                src={process.env.REACT_APP_SITE_LOGO}
                alt="site logo"
                loading="lazy"
                className="site_logo_image"
              />
              {process.env.REACT_APP_SITE_LOGO_TEXT && <h5>{process.env.REACT_APP_SITE_LOGO_TEXT}</h5>}
            </Link>
        </span>
      </div>
    </div>
  )
}

export default Header;