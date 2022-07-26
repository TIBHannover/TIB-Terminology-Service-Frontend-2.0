import React from 'react';
import { Link } from 'react-router-dom';

import '../../layout/Common.css'

function Navbar () {

  return (
    <div className='col-sm-8 navbar'>
      <Link to="/" className="navbar-item">Home</Link>
      <a href="/ontologies" className="navbar-item">Ontologies</a>
      <Link to="/help" className="navbar-item">Help</Link>
      <Link to="/documentation" className="navbar-item">Documentation</Link>
      <Link to="/about" className="navbar-item">About</Link>
    </div>
  )

}

export default Navbar;