import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
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
              <img src= {TIB_Logo} alt="tib logo" height={60} width={80} />
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