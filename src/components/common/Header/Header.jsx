import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
import NFDI4CHEM_Logo from "../../../assets/img/NFDI4Chem_Logo_mit_Claim/Web_Word_Powerpoint/png/NFDI4Chem-Logo-Claim_mehrfarbig_schwarz.png"
import '../../layout/Common.css';
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
              {process.env.REACT_APP_NFDI4CHEM_MAIN_LOGO === "false" &&
              <img src={NFDI4CHEM_Logo} alt="nfdi4chem_logo" height={100} width={180}/>
              }
              {process.env.REACT_APP_REMOVE_TIB_LOGO === "true" &&
              <img src= {TIB_Logo} alt="tib logo" height={60} width={80} />
              }
              <a className="main-title" href='/'>TERMINOLOGY SERVICE</a>
            </div>
            <Navbar />
          </div>
          <div className='row site-header-searchbox-holder'>
            <SearchForm />
          </div>
      </div>
    </div>
  )
}

export default Header;