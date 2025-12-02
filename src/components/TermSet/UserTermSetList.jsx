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
      <p className="fs-2 fw-bold">My termsets</p>
      <TermsetList
        termsets={appContext.userTermsets}
        redirectAfterDeleteEndpoint={"/mytermsets"}
        backBtnText="My termset list"
      />
    </>
  )
}

export default UserTermSetList;
