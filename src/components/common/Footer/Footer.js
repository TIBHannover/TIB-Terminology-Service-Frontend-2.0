import { Container, Row, Col} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import TIB_LOGO from '../../../assets/img/TIB_Logo_en.png';
import DFG_LOGO from '../../../assets/img/dfg_logo.png';
import CHEM_LOGO from '../../../assets/img/favicon-nfdi4chem.PNG'
import styled from 'styled-components';
import './Footer.css'

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
                                    <img src={CHEM_LOGO} alt="logo nfdi4chem" style={{ height: '55px' }} />
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
                                <Link to={""}>About us</Link>
                            </li>
                            <li>
                                <Link to={""}>Helpdesk</Link>
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
                <hr style={{ width: '70%', margin: '1rem auto' }} />
                <Row className="mt-4">
                    <PartnerLogoCol md={4} style={{}}>
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" style={{ borderWidth: 0, height: '60px' }} />
                        </a>
                    </PartnerLogoCol>
                    <Col md={8}>
                        <Row className="g-0">
                        <PartnerLogoCol md={{ size: 3, order: 1, offset: 3 }} style={{ textAlign: 'center' }}>
                        <img
                            src={DFG_LOGO}
                            alt="NFDI4Chem is supported by DFG under project number 441958208"
                            style={{ borderWidth: 0, height: '60px' }}
                        />
                        </PartnerLogoCol>
                        </Row>
                    </Col>
                </Row>
            </footer>
        </Container>
    </FooterWrapper>
);

export default Footer;
