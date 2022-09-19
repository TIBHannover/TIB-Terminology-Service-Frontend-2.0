import React from 'react';
import Navbar from '../Navbar/Navbar';
import TIB_Logo from '../../../assets/img/TIB_Logo_W_W.SVG';
import '../../layout/Common.css';
import SearchForm from "../../Search/SearchForm";
import collectionsInfoJson from "../../../assets/collectionsText.json";


function Header () {

  return (
    <div className='header-warpper'>
      <div className='container site-header'>
          <div className='row site-header-top-row'>
            {/* <a href="#">Login</a> */}
          </div>
          <div className='row site-header-nav-logo-holder'>
            <div className='col-lg-4 col-md-6'>
              {process.env.REACT_APP_PROJECT_ID === "nfdi4chem" && 
                <img src={collectionsInfoJson["NFDI4Chem"]["logo"]} alt="nfdi4chem_logo" height={250} width={350}/>
              }
              {process.env.REACT_APP_PROJECT_ID === "general" && 
                <span>
                  <img src= {TIB_Logo} alt="tib logo" height={60} width={80} /> 
                  <a className="main-title" href='/'>TERMINOLOGY SERVICE</a>
                </span>
              }              
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