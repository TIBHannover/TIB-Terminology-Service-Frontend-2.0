import { Link } from 'react-router-dom';

const Footer = () => (       
        <div className='row site-footer'>
            <div className="col-sm-4 footer-col">
                <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                    <img src="/dfg_logo.png" alt="" className="footer-logo"/>
                </a>
                <ul className="footer-list">
                    <li><small>NFDI4ING is funded by DFG</small></li>
                    <li><small>Project Number 442146713</small></li>
                </ul>
            </div>
            <div className="col-sm-2">
                <h6>ABOUT</h6>
                <hr className="me-5"/>
                <ul className="footer-list">
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"} className='footer-link'>Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"} className='footer-link'>Terms of use</Link>
                    </li>
                    <li>
                        <Link to={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"}  className='footer-link'>Imprint</Link>
                    </li>
                    <li><small>Free SVG Background by <a target="_blank" href="https://bgjar.com">BGJar</a></small></li>
                </ul>
            </div>

            <div className="col-sm-2">
                <h6>COMMUNITY</h6>
                <hr className="me-5" />
                <a href="https://nfdi4ing.de/" target="_blank" rel="noopener noreferrer">
                        <img src="/nfdi4ing_logo.png" alt="Logo NFDI4ING" className="footer-funding-logo" />
                </a>
            </div>
            <div className="col-sm-4">
                <h6>PROVIDED BY</h6>
                <hr className="me-5"/>
                <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                       <img src="/TIB_Logo_EN_WM_B.SVG" alt="Logo Technische Informationsbibliothek (TIB)" className="footer-logo" />
                </a>        
            </div>
        </div>            
);

export default Footer;
