import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { MatomoWrapper } from "./components/Matomo/MatomoWrapper";
import {
  BackendIsDownMessage,
  setSiteTitleAndFavIcon,
} from "./AppHelpers";
import Auth from "./Libs/AuthLib";
import { LoginLoadingAnimation } from "./components/User/Login/LoginLoading";
import { AppContext } from "./context/AppContext";
import { getReportList } from "./api/report";
import LoadingPage from "./LoadingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { olsIsUp } from "./api/system";
import { useQuery } from "@tanstack/react-query";
import { getUserTermsetList } from "./api/term_set";
import ErrorBoundary from "./errors/appErrorPage";
import "./components/layout/common.css";
import "./components/layout/mediaQueries.css";
import "./components/layout/custom.css";

const Footer = lazy(() => import("./components/common/Footer/Footer"));
const Header = lazy(() => import("./components/common/Header/Header"));
const CookieBanner = lazy(
  () => import("./components/common/CookieBanner/CookieBanner"),
);
const AppRouter = lazy(() => import("./Router"));
const SiteTour = lazy(() => import("./tours/Tour"));

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [reportsListForAdmin, setReportsListForAdmin] = useState<any[]>([]);
  const [userTermsets, setUserTermsets] = useState<any[]>([]);
  const [userTermsetsLoading, setUserTermsetsLoading] = useState(
    process.env.REACT_APP_AUTH_FEATURE === "true",
  );
  const [userSettings, setUserSettings] = useState({
    activeCollection: { title: "", ontology_ids: [] },
    userCollectionEnabled: false,
    advancedSearchEnabled: false,
    activeSearchSetting: {},
    activeSearchSettingIsModified: false,
  });
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const [includeImportedTerms, setIncludeImportedTerms] = useState(true);

  const olsIsUpQuery = useQuery({
    queryKey: ["olsIsUpCall"],
    queryFn: olsIsUp,
    meta: { cache: false },
  });

  useEffect(() => {
    if (olsIsUpQuery.isError) {
      setIsBackendDown(true);
    }
  }, [olsIsUpQuery.isError]);

  useEffect(() => {
    setSiteTitleAndFavIcon();

    if (process.env.REACT_APP_AUTH_FEATURE === "true") {
      let cUrl = window.location.href;
      if (cUrl.includes("code=")) {
        Auth.run();
      }

      Auth.userIsLogin().then((user) => {
        setUser(user);
        setIsSystemAdmin(user?.systemAdmin);
        let settings = { ...userSettings };
        settings.userCollectionEnabled = user?.settings?.userCollectionEnabled;
        settings.advancedSearchEnabled = user?.settings?.advancedSearchEnabled;
        settings.activeSearchSettingIsModified =
          user?.settings?.activeSearchSettingIsModified;
        if (user?.settings?.activeCollection?.title) {
          settings.activeCollection = user?.settings?.activeCollection;
        }
        if (user?.settings?.activeSearchSetting) {
          settings.activeSearchSetting = user?.settings?.activeSearchSetting;
        }

        if (user?.systemAdmin) {
          getReportList().then((reports) => {
            setReportsListForAdmin(reports);
          });
        }

        getUserTermsetList(user?.id)
          .then((termsets) => {
            setUserTermsets(termsets);
          })
          .finally(() => {
            setUserTermsetsLoading(false);
          });

        setUserSettings(settings);
        setShowLoadingPage(false);
      });
    } else {
      setShowLoadingPage(false);
    }
  }, []);

  const appContextData = {
    user: user,
    isUserSystemAdmin: isSystemAdmin,
    reportsListForAdmin: reportsListForAdmin,
    userSettings: userSettings,
    setUserSettings: setUserSettings,
    userTermsets: userTermsets,
    userTermsetsLoading: userTermsetsLoading,
    setUserTermsets: setUserTermsets,
    includeImportedTerms: includeImportedTerms,
    setIncludeImportedTerms: setIncludeImportedTerms,
  };

  return (
    <div className="App">
      <LoginLoadingAnimation />
      <BrowserRouter>
        <MatomoWrapper>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <AppContext.Provider value={appContextData}>
                  {showLoadingPage && (
                    <Suspense fallback={<LoadingPage />}>
                      <LoadingPage />
                    </Suspense>
                  )}
                  {!showLoadingPage && (
                    <Suspense fallback={<LoadingPage />}>
                      <Header />
                      <div
                        className="application-content"
                        id="application_content"
                      >
                        {isBackendDown && <BackendIsDownMessage />}
                        <CookieBanner />
                        <ErrorBoundary>
                          <AppRouter />
                        </ErrorBoundary>
                      </div>
                      {process.env.REACT_APP_SITE_TOUR === "true" &&
                        !showLoadingPage && <SiteTour />}
                      <Footer />
                    </Suspense>
                  )}
                </AppContext.Provider>
              </div>
            </div>
          </div>
        </MatomoWrapper>
      </BrowserRouter>
    </div>
  );
};

export default App;
