import {useState, useEffect} from 'react';
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import { BrowserRouter} from 'react-router-dom';
import { MatomoWrapper } from './components/Matomo/MatomoWrapper';
import  CookieBanner  from './components/common/CookieBanner/CookieBanner';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import { BackendIsDownMessage, setSiteTitleAndFavIcon, InlineWrapperWithMargin } from './AppHelpers';
import Auth from './Libs/AuthLib';
import AppRouter from './Router';
import { LoginLoadingAnimation } from './components/User/Login/LoginLoading';
import { AppContext } from './context/AppContext';
import { getReportList } from './api/tsMicroBackendCalls';
import LoadingPage from './LoadingPage';
import { olsIsUp } from './api/system';
import { useQuery } from '@tanstack/react-query';
import './components/layout/common.css';
import './components/layout/mediaQueries.css';
import './components/layout/custom.css';



const App = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [reportsListForAdmin, setReportsListForAdmin] = useState([]);
  const [userSettings, setUserSettings] = useState({
    "activeCollection": {"title": "", "ontology_ids": []}, 
    "userCollectionEnabled": false, 
    "advancedSearchEnabled": false, 
    "activeSearchSetting": {},
    "activeSearchSettingIsModified": false
  } );
  
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  const olsIsUpQuery = useQuery({queryKey:['olsIsUpCall'], queryFn: olsIsUp, meta:{cache: false}});
  if(olsIsUpQuery.isError){
    setIsBackendDown(true);
  }

  useEffect(() => {
    setSiteTitleAndFavIcon();

    if(process.env.REACT_APP_AUTH_FEATURE === "true"){   
      let cUrl = window.location.href;
      console.log(cUrl)
      if(cUrl.includes("code=")){
        Auth.run();       
      }

      Auth.userIsLogin().then((user) => {
        setUser(user);
        setIsSystemAdmin(user?.systemAdmin);
        let settings = {...userSettings};                
        settings.userCollectionEnabled = user?.settings?.userCollectionEnabled;
        settings.advancedSearchEnabled = user?.settings?.advancedSearchEnabled; 
        settings.activeSearchSettingIsModified = user?.settings?.activeSearchSettingIsModified;       
        if(user?.settings?.activeCollection?.title){
          settings.activeCollection = user?.settings?.activeCollection;          
        }
        if(user?.settings?.activeSearchSetting){
          settings.activeSearchSetting = user?.settings?.activeSearchSetting;          
        }
        
        if(user?.systemAdmin){
          getReportList().then((reports) => {
            setReportsListForAdmin(reports);
          });
        }        

        setUserSettings(settings); 
        setShowLoadingPage(false);    
      });      
    }
    else{
      setShowLoadingPage(false); 
    }

    setTimeout( () => {
      setLoading(false);
    }, 500);

  }, []);


  const appContextData = {
    user: user,
    isUserSystemAdmin: isSystemAdmin,
    reportsListForAdmin: reportsListForAdmin,
    userSettings: userSettings,
    setUserSettings: setUserSettings,
  };

  return (
    <div className="App">
      <LoginLoadingAnimation />
     <BrowserRouter>
        <MatomoWrapper> 
        <div className='container-fluid'>
            <AppContext.Provider  value={appContextData}>
              {showLoadingPage && <LoadingPage /> }
              {!showLoadingPage &&
                <>
                <Header />
                <div className='application-content'  id="application_content">
                  {loading && 
                    <Skeleton 
                      count={2} 
                      wrapper={InlineWrapperWithMargin} 
                      inline width={600} 
                      height={200} 
                      marginLeft={20} 
                      baseColor={'#f4f2f2'}/>
                  }
                  {!loading &&
                    <>            
                      {isBackendDown && <BackendIsDownMessage />}
                      <CookieBanner />
                      <AppRouter />        
                    </>   
                  }
                </div>
                <Footer />
                </>
              }
            </AppContext.Provider>                  
          </div>             
        </MatomoWrapper>
      </BrowserRouter>      
    </div>
  );
}

export default App;


