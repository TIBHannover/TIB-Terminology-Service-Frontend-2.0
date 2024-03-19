import { useContext } from "react"
import { AppContext } from "../../../context/AppContext"



const ResolveReportActionsForAdmins = () => {

    const appContext = useContext(AppContext);

    if(!appContext.isUserSystemAdmin){
        return "ff";
    }

    return "tt";

}

export default ResolveReportActionsForAdmins;