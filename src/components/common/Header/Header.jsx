import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG'

import '../../layout/Common.css';

function Header () {

  return (
    <section className="header">
      <section className="header-top">
        <section className="header-top__logo">
          <img src= {TIB_Logo} alt="tib logo" height={100} width={180} />
          <a className="main-title" >TERMINOLOGY SERVICE</a>
        </section>
        <section className="header-top__navbar">
          <section className="header-top__navigation">
            <Navbar />
          </section>
          <hr className="header-top__seperator" />
        </section>
      </section>
    </section>
  )
}

export default Header;