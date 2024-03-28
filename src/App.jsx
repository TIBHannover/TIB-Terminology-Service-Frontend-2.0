import {useState, useEffect} from 'react';
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter} from 'react-router-dom';
import { MatomoWrapper } from './components/Matomo/MatomoWrapper';
import  CookieBanner  from './components/common/CookieBanner/CookieBanner';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import AppHelpers from './AppHelpers';
import { isLogin, checkIsSystemAdmin, auth } from './components/User/Login/TS/Auth';
import AppRouter from './Router';
import { LoginLoadingAnimation } from './components/User/Login/LoginLoading';
import { AppContext } from './context/AppContext';
import './components/layout/common.css';
import './components/layout/mediaQueries.css';
import './components/layout/custom.css';



const App = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  
  
  useEffect(() => {
    AppHelpers.setSiteTitleAndFavIcon();
    AppHelpers.checkBackendStatus();
    
    if(process.env.REACT_APP_AUTH_FEATURE === "true"){   
      let cUrl = window.location.href;
      if(cUrl.includes("code=")){
        auth();        
      }
      
      isLogin().then((resp) => {setUser(resp);});
      
      checkIsSystemAdmin().then((resp) => {        
        setIsSystemAdmin(resp);
      });
    }

    setTimeout( () => {
      setLoading(false);
    }, 500);

  }, []);


  const appContextData = {
    user: user,
    isUserSystemAdmin: isSystemAdmin
  };

  return (
    <div className="App">
      <LoginLoadingAnimation />
     <BrowserRouter>
        <MatomoWrapper> 
        <div className='container-fluid'>
            <AppContext.Provider  value={appContextData}>
              <Header />
              <div className='application-content'  id="application_content">
                {loading && 
                  <Skeleton 
                    count={2} 
                    wrapper={AppHelpers.InlineWrapperWithMargin} 
                    inline width={600} 
                    height={200} 
                    marginLeft={20} 
                    baseColor={'#f4f2f2'}/>
                }
                {!loading &&
                  <>            
                    <span id="backend-is-down-message-span"></span>
                    <CookieBanner />
                    <AppRouter />        
                  </>   
                }
              </div>
              <Footer /> 
            </AppContext.Provider>                  
          </div>             
        </MatomoWrapper>
      </BrowserRouter>      
    </div>
  );
}

export default App;


