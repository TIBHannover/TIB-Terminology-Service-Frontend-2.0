import {Link} from "react-router-dom";

const Footer = () => (
  <div className="row site-footer">
    <div className="col-sm-4 footer-col">
      <a
        href="https://www.dfg.de/en/index.jsp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/dfg_logo_schriftzug_weiss_foerderung_en.gif" alt="dfg-logo" className="footer-logo"
             loading="lazy"/>
      </a>
    </div>
    <div className="col-sm-2">
      <p>ABOUT</p>
      <hr className="me-5"/>
      <ul className="footer-list">
        <li>
          <Link
            to={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"}
            className="footer-link"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            to={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"}
            className="footer-link"
          >
            Terms of use
          </Link>
        </li>
        <li>
          <Link
            to={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"}
            className="footer-link"
          >
            Imprint
          </Link>
        </li>
      </ul>
    </div>
    <div className="col-sm-2">
      <p>RESOURCES</p>
      <hr className="me-5"/>
      <ul className="footer-list">
        <li>
          <Link
            to={process.env.REACT_APP_PROJECT_SUB_PATH + "/api"}
            className="footer-link"
          >
            Documentation
          </Link>
        </li>
        <li>
          <a
            href="https://api.terminology.tib.eu/swagger-ui/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            API
          </a>
        </li>
        <li>
          <Link
            className="footer-link"
            to={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}
          >
            Contact us
          </Link>
        </li>
      </ul>
    </div>
    <div className="col-sm-4">
      <p>PROVIDED BY</p>
      <hr className="me-5"/>
      <a
        href="https://www.tib.eu/en/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/TIB_Logo_EN_WM_W.SVG"
          alt="Logo Technische Informationsbibliothek (TIB)"
          className="footer-logo"
          loading="lazy"
        />
      </a>
    </div>
  </div>
);

export default Footer;
