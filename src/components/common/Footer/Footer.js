import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import TIB_LOGO from '../../../assets/img/TIB_Logo_EN_WM_W.SVG';
import DFG_LOGO from '../../../assets/img/dfg_logo_schriftzug_weiss_foerderung_en.gif';


const Footer = () => (       
        <div className='row site-footer'>
            <div className="col-sm-4 footer-col">
                <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                    <img src={DFG_LOGO} alt="" className="footer-logo"/>
                </a>
            </div>

            <div className="col-sm-2">
                <h6>ABOUT</h6>
                <hr className="me-5"/>
                <ul className="footer-list">
                    <li>
                        <a href="/PrivacyPolicy" className='footer-link'>Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/TermsOfUse" className='footer-link'>Terms of use</a>
                    </li>
                    <li>
                        <a href="/imprint" className='footer-link'>Imprint</a>
                    </li>
                </ul>
            </div>

            <div className="col-sm-2">
                <h6>RESOURCES</h6>
                <hr className="me-5" />
                <ul className="footer-list">
                    <li>
                        <Link to={""} className='footer-link'>Documentation</Link>
                    </li>
                    <li>
                        <Link to={""} className='footer-link'>API</Link>
                    </li>
                </ul>
                
            </div>


            <div className="col-sm-4">
                <h6>PROVIDED BY</h6>
                <hr className="me-5"/>
                <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                    <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" className="footer-logo" />
                </a>
            </div>
        </div>            
);

export default Footer;
