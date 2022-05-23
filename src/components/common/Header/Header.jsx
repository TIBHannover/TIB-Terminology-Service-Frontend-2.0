import React from 'react';
import Navbar from '../Navbar/Navbar';

import '../../layout/Common.css';

function Header () {

  return (
    <section className="header">
      <section className="header-top">
        <section className="header-top__logo">
          <img src={"https://www.tib.eu/typo3conf/ext/tib_tmpl_bootstrap/Resources/Public/gfx/logos/tib-full-en.svg"} alt="tib logo" height={200} width={480} />
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