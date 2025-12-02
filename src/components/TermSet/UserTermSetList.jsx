import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "../layout/termset.css";
import TermsetList from "./TermsetList";


const UserTermSetList = () => {
  const appContext = useContext(AppContext);

  if (process.env.REACT_APP_TERMSET_FEATURE !== "true") {
    return "";
  }

  return (
    <>
      <TermsetList
        termsets={appContext.userTermsets}
        redirectAfterDeleteEndpoint={"/mytermsets"}
        backBtnText="My termset list"
      />
    </>
  )
}

export default UserTermSetList;
