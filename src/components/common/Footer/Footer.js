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
                {process.env.REACT_APP_DFG_PROJECT_SHOW === "false" &&
                <ul className="footer-list">
                  <li>NFDI4Chem is funded by DFG</li>
                  <li>Project Number 441958208</li>
                </ul>
                }
            </div>

            <div className="col-sm-2">
                <h6>ABOUT</h6>
                <hr className="me-5"/>
                <ul className="footer-list">
                    <li>
                        <Link to="/PrivacyPolicy" className='footer-link'>Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to="/TermsOfUse" className='footer-link'>Terms of use</Link>
                    </li>
                    <li>
                        <Link to="/imprint"  className='footer-link'>Imprint</Link>
                    </li>
                </ul>
            </div>

            <div className="col-sm-2">
                <h6>RESOURCES</h6>
                <hr className="me-5" />
                {process.env.REACT_APP_NFDI4CHEM_FOOTER_RESOURCES === "false" &&
                <ul className="footer-list">
                  <li><a href="https://www.nfdi4chem.de/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Website</a></li>
                  <li><a href="https://www.nfdi4chem.de/index.php/frequently-asked-questions/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem FAQ</a></li>
                  <li><a href="https://www.nfdi4chem.de/index.php/helpdesk/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Helpdesk</a></li>
                  <li><a href="https://knowledgebase.nfdi4chem.de/knowledge_base/" target="_blank" rel="noopener noreferrer" className='footer-link'>NFDI4Chem Knowledge Base</a></li>
                  <li><a href="https://github.com/NFDI4Chem" target="_blank" rel="noopener noreferrer" className='footer-link'>GitHub repository</a></li>
                </ul>
                }
                {process.env.REACT_APP_REMOVE_FOOTER_RESOURCES === "true" &&
                <ul className="footer-list">
                    <li>
                        <Link to="/Documentation" className='footer-link'>Documentation</Link>
                    </li>
                    <li>
                        <Link to="/AboutApi" className='footer-link'>API</Link>
                    </li>
                </ul>
                }
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
