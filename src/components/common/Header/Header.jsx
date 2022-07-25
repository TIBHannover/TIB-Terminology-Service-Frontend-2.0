import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
import '../../layout/Common.css';
import SearchForm from "../../Search/SearchForm";

function Header () {

  return (
    <div className='header-warpper'>
      <div className='container-fluid site-header'>
        <div className='row site-header-top-row'>
          <a href="#">Login</a>
        </div>
        <div className='row site-header-nav-logo-holder'>
          <div className='col-sm-3'>
            <img src= {TIB_Logo} alt="tib logo" height={40} width={80} />
            <a className="main-title" href='/'>TERMINOLOGY SERVICE</a>
          </div>
          <Navbar />
        </div>
        <div className='row site-header-searchbox-holder'>
          <SearchForm />
        </div>
    </div>
      
      {/* <section className="header">
        <section className="header-top">
          <section className="header-top__logo">
            <img src= {TIB_Logo} alt="tib logo" height={80} width={180} />
            <a className="main-title" href='/'>TERMINOLOGY SERVICE</a>
          </section>
          <div className="position-absolute top-0 end-0">
            Login
          </div>
          <section className="header-top__navbar">
            <section className="header-top__navigation">
              <Navbar />
            </section>
          </section>
        </section>
      </section> */}
    </div>
  )
}

export default Header;