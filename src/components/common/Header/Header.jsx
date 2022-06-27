import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG'
import SearchForm from '../../Search/SearchForm';

import '../../layout/Common.css';

function Header () {

  return (
    <section className="header">
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
    </section>
  )
}

export default Header;