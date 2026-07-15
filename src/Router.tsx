import RequireLoginRoute from "./components/User/Login/RequireLoginRoute";
import { Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import LoadingPage from "./LoadingPage";

const lazyAny = (factory: () => Promise<{ default: unknown }>) =>
  lazy(async () => {
    const module = await factory();
    return { default: module.default as ComponentType<any> };
  });

const OntologyList = lazy(
  () => import("./components/Ontologies/OntologyList/OntologyList"),
);
const OntologyPage = lazy(
  () => import("./components/Ontologies/OntologyPage/OntologyPage"),
);
const Home = lazy(() => import("./components/Home/Home"));
const SearchResult = lazy(
  () => import("./components/Search/SearchResult/SearchResult"),
);
const Documentation = lazy(
  () => import("./components/Documentation/Documentation"),
);
const Collections = lazy(() => import("./components/Collection/Collection"));
const Imprint = lazy(() => import("./components/Imprint/imprint"));
const PrivacyPolicy = lazy(
  () => import("./components/PrivacyPolicy/PrivacyPolicy"),
);
const TermsOfUse = lazy(() => import("./components/TermsOfUse/TermsOfUse"));
const About = lazy(() => import("./components/About/About"));
const Help = lazy(() => import("./components/Help/Help"));
const UsagePage = lazy(() => import("./components/Usage/Usage"));
const SubmitedIssueRequests = lazyAny(
  () =>
    import(
      "./components/User/SubmitedIssueRequests/SubmitedIssueRequests"
    ),
);
const UserProfile = lazy(() => import("./components/User/Profile/Profile"));
const UserPanel = lazy(() => import("./components/User/Login/UserPanel"));
const ReportPanel = lazyAny(
  () => import("./components/User/Admin/ReportPanel"),
);
const UserCollection = lazy(
  () => import("./components/User/Collection/Collection"),
);
const ContactForm = lazy(
  () => import("./components/User/ContactForm/ContactForm"),
);
const OntologySuggestion = lazy(
  () =>
    import(
      "./components/Ontologies/OntologySuggestion/OntologySuggestion"
    ),
);
const TermSetPage = lazyAny(() => import("./components/TermSet/TermSetPage"));
const UserTermSetList = lazy(
  () => import("./components/TermSet/UserTermSetList"),
);
const EditTermset = lazy(() => import("./components/TermSet/EditTermset"));
const NotFoundPage = lazy(() => import("./errors/notFound"));
const BrowseTermSetList = lazyAny(
  () => import("./components/TermSet/browseTermsetList"),
);
const UserApiKey = lazy(() => import("./components/User/APIKEY/ApiKey"));
const CollectionPage = lazy(
  () => import("./components/Collection/CollectionPage"),
);

const AppRouter = () => {
  const TermSetPageComponent = TermSetPage as any;
  const BrowseTermSetListComponent = BrowseTermSetList as any;

  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/"}
          component={Home}
        />
        <Route
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/login"}
          component={UserPanel}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/myprofile"}
          component={UserProfile}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/apikey"}
          component={UserApiKey}
        />
        <RequireLoginRoute
          path={
            process.env.REACT_APP_PROJECT_SUB_PATH + "/submitedIssueRequests"
          }
          component={SubmitedIssueRequests}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/reports"}
          component={ReportPanel}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/mytermsets"}
          component={UserTermSetList}
        />
        <RequireLoginRoute
          path={
            process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/:termsetId/edit"
          }
          component={EditTermset}
        />
        <Route
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets/:termsetId"}
          component={TermSetPageComponent}
        />
        <Route
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/termsets"}
          component={BrowseTermSetListComponent}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/mycollections"}
          component={UserCollection}
        />
        <RequireLoginRoute
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologysuggestion"}
          component={OntologySuggestion}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/ontologies"}
          component={OntologyList}
        />
        <Route
          exact
          path={
            process.env.REACT_APP_PROJECT_SUB_PATH +
            "/ontologies/:ontologyId/:tab?"
          }
          component={OntologyPage}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/docs"}
          component={Documentation}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/search"}
          component={SearchResult}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/imprint"}
          component={Imprint}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/PrivacyPolicy"}
          component={PrivacyPolicy}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/TermsOfUse"}
          component={TermsOfUse}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/about"}
          component={About}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/help"}
          component={Help}
        />
        <Route
          exact
          path={process.env.REACT_APP_PROJECT_SUB_PATH + "/contact"}
          component={ContactForm}
        />
        {process.env.REACT_APP_COLLECTION_TAB_SHOW === "true" && (
          <>
            <Route
              exact
              path={
                process.env.REACT_APP_PROJECT_SUB_PATH +
                "/collections/:collectionId"
              }
              component={CollectionPage}
            />
            <Route
              exact
              path={process.env.REACT_APP_PROJECT_SUB_PATH + "/collections"}
              component={Collections}
            />
          </>
        )}
        {process.env.REACT_APP_PROJECT_ID === "nfdi4ing" && (
          <Route
            exact
            path={process.env.REACT_APP_PROJECT_SUB_PATH + "/usage"}
            component={UsagePage}
          />
        )}
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};

export default AppRouter;
