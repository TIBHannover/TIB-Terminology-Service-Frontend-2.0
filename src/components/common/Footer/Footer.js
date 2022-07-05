import { Container, Row, Col} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import TIB_LOGO from '../../../assets/img/TIB_Logo_EN_WM_W.SVG';
import DFG_LOGO from '../../../assets/img/dfg_logo_schriftzug_weiss_foerderung_en.gif';
import styled from 'styled-components';

const FooterWrapper = styled.div`
    background: #2B3C46;
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

const Footer = () => (
    <FooterWrapper>
        <Container>
            <footer className="pt-4 pb-4">
                <Row>
                <FooterCol md={3}>
                        <PartnerLogoCol md={4} style={{ textAlign: 'center' }}>
                        <a href="https://www.dfg.de/en/index.jsp" target="_blank" rel="noopener noreferrer">
                        <img
                            src={DFG_LOGO}
                            alt=""
                            style={{ borderWidth: 0, height: '100px' }}
                        />
                        </a>
                        </PartnerLogoCol>
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5" style={{ color: 'white'}}>ABOUT</h2>
                        <hr className="me-5" />
                        <ul className="p-0" style={{ listStyle: 'none' }}>
                            <li>
                                <Link to={""} style={{ color: 'white'}}>Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to={""} style={{ color: 'white'}}>Terms of use</Link>
                            </li>
                            <li>
                                <Link to={""} style={{ color: 'white'}}>Imprint</Link>
                            </li>
                        </ul>
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5" style={{ color: 'white'}}>RESOURCES</h2>
                        <hr className="me-5" />
                        <ul className="p-0" style={{ listStyle: 'none' }}>
                            <li>
                                <Link to={""} style={{ color: 'white'}}>Documentation</Link>
                            </li>
                            <li>
                                <Link to={""} style={{ color: 'white'}}>API</Link>
                            </li>
                        </ul>
                        
                    </FooterCol>
                    <FooterCol md={3}>
                        <h2 className="h5" style={{ color: 'white'}}>PROVIDED BY</h2>
                        <hr className="me-5" />
                        <PartnerLogoCol md={4} style={{}}>
                        <a href="https://www.tib.eu/en/" target="_blank" rel="noopener noreferrer">
                            <img src={TIB_LOGO} alt="Logo Technische Informationsbibliothek (TIB)" style={{ borderWidth: 0, height: '60px' }} />
                        </a>
                    </PartnerLogoCol>
                    </FooterCol>
                </Row>
            </footer>
        </Container>
    </FooterWrapper>
);

export default Footer;
