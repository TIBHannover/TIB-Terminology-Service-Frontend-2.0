import React from 'react';
import { Navbar } from '../../common/Navbar/Navbar'

import './Header.css';

function Header () {

  return (
    <section className="header">
      <section className="header-top">
        <section className="header-top__logo">
          <img src={"https://www.nfdi4chem.de/wp-content/uploads/2021/11/cropped-NFDI4Chem-Logo-Claim_mehrfarbig_schwarz-e1636478409489.png"} alt="nfdi4chem logo" height={90} width={180} />
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