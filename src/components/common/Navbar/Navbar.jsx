import React from 'react';
import { Link } from 'react-router-dom';

import '../../layout/Common.css'

function Navbar () {

  return (
    <div className='col-lg-8 col-md-6'>
         <nav class="navbar navbar-expand-xl site-navbar">   
         <button class="navbar-toggler navbar-collapse-btn" type="button" data-toggle="collapse" data-target="#siteMainNavbar">           
            <i class="fa fa-bars collpase-btn-content"></i>
          </button>  
            <div class="collapse navbar-collapse" id="siteMainNavbar">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/collections">Collections</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/ontologies">Ontologies</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/help">Help</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/documentation">Documentation</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link navbar-item" href="/about">About</a>
                </li>
              </ul>
            </div>            
        </nav>
    </div>
  )

}

export default Navbar;