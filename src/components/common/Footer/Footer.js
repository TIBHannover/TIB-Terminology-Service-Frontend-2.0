import { Container, Row, Col} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
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
                <h1 className="sr-only">More information about TS</h1>
                <Row>
                    <FooterCol md={4}>
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
                    <FooterCol md={4}>
                        <h2 className="h5">Maintainer</h2>
                        <hr className="me-5" />
                        <PartnerLogoCol md={4} style={{}}>
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" style={{ borderWidth: 0, height: '80px' }} />
                        </a>
                    </PartnerLogoCol>
                    </FooterCol>
                    <FooterCol md={4}>
                        <h2 className="h5">Funding</h2>
                        <hr className="me-5" />
                        <PartnerLogoCol md={4} style={{ textAlign: 'center' }}>
                        <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                        <img
                            src={DFG_LOGO}
                            alt=""
                            style={{ borderWidth: 0, height: '80px' }}
                        />
                        </a>
                        </PartnerLogoCol>
                    </FooterCol>
                </Row>
            </footer>
        </Container>
    </FooterWrapper>
);

export default Footer;
