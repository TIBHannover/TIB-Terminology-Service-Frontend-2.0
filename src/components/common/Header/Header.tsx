import SiteNavbar from '../Navbar/Navbar';
import SearchForm from '../../Search/SearchForm/SearchForm';
import UserPanel from '../../User/Login/UserPanel';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <>
      <div className='row header-wrapper header-collapseable-section'>
        <div className="col-sm-12">
          <div className='row site-header-primary-row align-items-center'>
            <div className='col-7 col-md-3 site-header-logo-col'>
              <SiteLogo />
            </div>
            <div className='col-2 col-md-6 site-header-nav-col'>
              <div className="row">
                <div className='col-sm-12'>
                  <SiteNavbar />
                </div>
              </div>
            </div>
            <div className='col-3 col-md-3 text-center site-header-user-col'>
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
        <span>
          <Link className="main-title" to={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>
            <embed
              src={process.env.REACT_APP_SITE_LOGO}
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
