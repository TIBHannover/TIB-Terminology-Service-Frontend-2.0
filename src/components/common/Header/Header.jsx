import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
import SearchForm from '../../Search/SearchForm/SearchForm';
// import LoginForm from '../../User/Login/Login';
import Login from '../../User/Login/TS/Login';


function Header () {
  return (
    <div className='row header-wrapper header-collapseable-section'>
      <div className='col-sm-10 site-header'>
          <div className='row'>
            <div className='col-sm-11 text-right'>
              <Login isModal={true}></Login>            
            </div>                      
          </div>
          <div className='row site-header-nav-logo-holder'>
            <div className='col-lg-4 col-md-6'>                         
              {process.env.REACT_APP_PROJECT_ID === "general" && 
                <span>
                  <img src= {TIB_Logo} alt="tib logo" height={60} width={80} /> 
                  <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span>
              }
              {process.env.REACT_APP_PROJECT_ID !== "general" && 
                <span>
                    <img src="/site_logo.png" alt="site_logo" className='site-logo-image'/>
                    <a className="main-title" href={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}>TERMINOLOGY SERVICE</a>
                </span> 
              }        
            </div>
            <Navbar />
          </div>      
            <SearchForm />          
      </div>
    </div>
  )
}

export default Header;