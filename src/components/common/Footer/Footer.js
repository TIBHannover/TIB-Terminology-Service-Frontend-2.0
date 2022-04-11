import { Container, Row, Col} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ReactComponent as Logo } from '../../../assets/img/vertical_logo.svg';
import TIB_LOGO from '../../../assets/img/TIB_Logo_en.png';
import DFG_LOGO from '../../../assets/img/dfg_logo.png';
import styled from 'styled-components';

const FooterWrapper = styled.div`
    background: #e0e2ea;
    margin-top: 75px;
    border-top: 1px #d1d3d9 solid;
`;

const FooterCol = styled(Col)`
    color: ${props => props.theme.secondaryDarker};
    margin: 10px 0;
    font-size: 0.95rem;

    h5 {
        font-weight: 500;
        text-transform: uppercase;
        color: ${props => props.theme.secondaryDarker};
        font-size: 1.1rem;
    }
    .description {
        font-size: 0.85rem;
    }
    a {
        color: ${props => props.theme.secondaryDarker};
    }
`;

const PartnerLogoCol = styled(Col)`
    text-align: center;
`;

const TwitterLink = styled.a`
    :hover {
        color: #00acee;
    }
`;

const Footer = () => (
    <FooterWrapper>
        <Container>
            <footer className="pt-4 pb-4">
                <h1 className="sr-only">More information about NFDI4Chem</h1>
                <Row>
                    <FooterCol md={3}>
                        <h2 className="h5">NFDI4Chem</h2>
                        <hr className="me-5" />
                        <Row>
                            <div className="float-start col-md-3">
                                <Link to={{pathname: "https://www.nfdi4chem.de/"}}>
                                    <Logo style={{ height: '80px' }} />
                                </Link>
                            </div>
                            <div className="col-md-8 description">
                            NFDI4Chem is an initiative to build an open and FAIR infrastructure for research data management in chemistry.
                            </div>
                        </Row>
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5">About</h2>
                        <hr className="me-5" />
                        <ul className="p-0" style={{ listStyle: 'none' }}>
                            <li>
                                <Link to={{pathname: "https://www.nfdi4chem.de/index.php/konsortium/"}}>About us</Link>
                            </li>
                            <li>
                                <Link to={{pathname: "https://www.nfdi4chem.de/index.php/helpdesk/"}}>Helpdesk</Link>
                            </li>
                            {/*<li>
                                <a href="https://projects.tib.eu/orkg/get-involved/" target="_blank" rel="noopener noreferrer">
                                    Get involved
                                </a>
                            </li>*/}
                            <li>
                                <Link to={""}>Data protection</Link>
                            </li>
                            <li>
                                <Link to={""}>Terms of use</Link>
                            </li>
                            <li>
                                <Link to={""}>Imprint</Link>
                            </li>
                        </ul>
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5">Technical</h2>
                        <hr className="me-5" />
                        <ul className="p-0" style={{ listStyle: 'none' }}>
                            <li>
                                <a href="" target="_blank" rel="noopener noreferrer">
                                    GitLab
                                </a>
                            </li>
                            <li>
                                <Link to={""}>Accessibility</Link>
                            </li>
                            <li>
                                <Link to={""}>License</Link>
                            </li>
                        </ul>
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5">More</h2>
                        <hr className="me-5" />
                        <ul className="p-0" style={{ listStyle: 'none' }}>
                            <li>
                                <TwitterLink href="https://twitter.com/Nfdi4Chem" target="_blank" rel="noopener noreferrer">
                                    Follow us
                                    <Icon className="ms-2" icon={faTwitter} />
                                </TwitterLink>
                            </li>
                            <li>
                                <a href="" target="_blank" rel="noopener noreferrer">
                                    Report an issue
                                </a>
                            </li>
                        </ul>
                    </FooterCol>
                </Row>
            </footer>
        </Container>
    </FooterWrapper>
);

export default Footer;
