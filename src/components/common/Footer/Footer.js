import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import TIB_LOGO from '../../../assets/img/TIB_Logo_EN_WM_W.SVG';
import DFG_LOGO from '../../../assets/img/dfg_logo_schriftzug_weiss_foerderung_en.gif';


const Footer = () => (       
        <div className='row site-footer'>
            <div className="col-sm-3">
                <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                    <img
                        src={DFG_LOGO}
                        alt=""
                        style={{ borderWidth: 0, height: '100px' }}
                    />
                </a>
            </div>

            <div className="col-sm-3">
                <h5>ABOUT</h5>
                <hr className="me-5" />
                <ul className="p-0" style={{ listStyle: 'none' }}>
                    <li>
                        <a href="/PrivacyPolicy" className='footer-link' target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/TermsOfUse" target="_blank" className='footer-link' rel="noopener noreferrer">Terms of use</a>
                    </li>
                    <li>
                        <a href="/imprint" target="_blank" className='footer-link' rel="noopener noreferrer">Imprint</a>
                    </li>
                </ul>
            </div>

            <div className="col-sm-3">
                <h5>RESOURCES</h5>
                <hr className="me-5" />
                <ul className="p-0" style={{ listStyle: 'none' }}>
                    <li>
                        <Link to={""} className='footer-link'>Documentation</Link>
                    </li>
                    <li>
                        <Link to={""} className='footer-link'>API</Link>
                    </li>
                </ul>
                
            </div>


            <div className="col-sm-3">
                <h5>PROVIDED BY</h5>
                <hr className="me-5" />
                <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                    <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" style={{ borderWidth: 0, height: '60px' }} />
                </a>
            </div>
        </div>            
);

export default Footer;
